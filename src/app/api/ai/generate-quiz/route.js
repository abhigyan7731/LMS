import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin-cjs'
import { randomUUID } from 'crypto'
import { generateLocalChapterQuiz } from '@/lib/quiz-bank'

/**
 * Chapter Quiz Generator
 * 
 * Priority order:
 *   1. Google Gemini API (free tier)
 *   2. OpenAI API (if configured)
 *   3. Local question bank (always works)
 */

async function generateWithGemini(content, systemPrompt) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || apiKey === 'xxx') return null

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `${systemPrompt}\n\nContent:\n${content}\n\nReturn ONLY valid JSON (no markdown code blocks).`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim()
    const parsed = JSON.parse(cleaned)
    return parsed.questions || []
  } catch (e) {
    console.warn('[generate-quiz] Gemini failed:', e.message)
    return null
  }
}

async function generateWithOpenAI(content, systemPrompt) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey || apiKey === 'sk-xxx') return null

  try {
    const OpenAI = (await import('openai')).default
    const openai = new OpenAI({ apiKey })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    const text = completion.choices[0]?.message?.content
    if (!text) return null
    const parsed = JSON.parse(text)
    return parsed.questions || []
  } catch (e) {
    console.warn('[generate-quiz] OpenAI failed:', e.message)
    return null
  }
}

export async function POST(request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { chapter_id, transcript } = body

    if (!chapter_id) return NextResponse.json({ error: 'chapter_id required' }, { status: 400 })

    // Fetch chapter + course info for context
    const supabase = createAdminClient()
    const { data: chapter } = await supabase
      .from('chapters')
      .select('title, description, course_id')
      .eq('id', chapter_id)
      .single()

    let courseTitle = ''
    let courseCategory = ''
    if (chapter?.course_id) {
      const { data: course } = await supabase
        .from('courses')
        .select('title, category')
        .eq('id', chapter.course_id)
        .single()
      courseTitle = course?.title || ''
      courseCategory = course?.category || ''
    }

    // Build AI content
    const hasTranscript = transcript && transcript.trim().length > 20
    let content = ''

    if (hasTranscript) {
      content = transcript.slice(0, 6000)
    } else {
      const chapterTitle = chapter?.title || 'Unknown Chapter'
      const chapterDesc = chapter?.description || ''
      content = `Course: ${courseTitle}${courseCategory ? ` (Category: ${courseCategory})` : ''}
Chapter: ${chapterTitle}
${chapterDesc ? `Chapter Description: ${chapterDesc}` : ''}

Generate quiz questions about the topic "${chapterTitle}" within the context of "${courseTitle}".`
    }

    const systemPrompt = `Generate a multiple-choice quiz with 5 questions${hasTranscript ? ' based on the given lecture transcript' : ' about the given topic'}. 
Each question must have exactly 4 options with exactly one correct answer.
${!hasTranscript ? 'Make the questions educational and test real knowledge relevant to the topic.' : 'Focus on key concepts from the content.'}
Respond with valid JSON only:
{
  "questions": [
    {
      "question": "string",
      "options": [
        { "id": "a", "text": "string", "isCorrect": true/false },
        { "id": "b", "text": "string", "isCorrect": true/false },
        { "id": "c", "text": "string", "isCorrect": true/false },
        { "id": "d", "text": "string", "isCorrect": true/false }
      ]
    }
  ]
}`

    // Try AI providers, then fall back to local
    let rawQuestions = await generateWithGemini(content, systemPrompt)

    if (!rawQuestions) {
      rawQuestions = await generateWithOpenAI(content, systemPrompt)
    }

    let questions
    if (rawQuestions && rawQuestions.length > 0) {
      questions = rawQuestions.map((q, idx) => ({
        id: randomUUID(),
        question: q.question,
        position: idx,
        options: (q.options || []).map((o, i) => ({
          id: String.fromCharCode(97 + i),
          text: o.text,
          isCorrect: o.isCorrect ?? false,
        })),
      }))
    } else {
      // Local fallback
      console.log('[generate-quiz] Using local question bank')
      questions = generateLocalChapterQuiz(
        chapter?.title || '',
        courseTitle,
        courseCategory
      ).map((q) => ({ ...q, id: randomUUID() }))
    }

    if (questions.length === 0) {
      return NextResponse.json({ error: 'Failed to generate quiz questions.' }, { status: 500 })
    }

    // Save to database
    const { data: existing } = await supabase
      .from('quizzes')
      .select('id')
      .eq('chapter_id', chapter_id)
      .single()

    if (existing) {
      await supabase.from('quiz_questions').delete().eq('quiz_id', existing.id)
      for (const q of questions) {
        await supabase.from('quiz_questions').insert({
          quiz_id: existing.id,
          question: q.question,
          options: q.options,
          position: q.position,
        })
      }
    } else {
      const { data: quiz } = await supabase.from('quizzes').insert({ chapter_id }).select('id').single()
      if (quiz) {
        for (const q of questions) {
          await supabase.from('quiz_questions').insert({
            quiz_id: quiz.id,
            question: q.question,
            options: q.options,
            position: q.position,
          })
        }
      }
    }

    return NextResponse.json({ questions })
  } catch (e) {
    console.error('[generate-quiz] Error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to generate quiz' },
      { status: 500 }
    )
  }
}
