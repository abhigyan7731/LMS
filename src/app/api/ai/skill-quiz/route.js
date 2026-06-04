import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { generateLocalQuiz } from '@/lib/quiz-bank'

/**
 * Skill Assessment Quiz Generator
 * 
 * Priority order:
 *   1. Google Gemini API (free tier — 15 RPM, 1500 RPD)
 *   2. OpenAI API (if configured)
 *   3. Local question bank (always works, no API needed)
 */

async function generateWithGemini(focusArea, topic, subtopic) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || apiKey === 'xxx') return null

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `Generate exactly 10 multiple-choice quiz questions to assess a student's knowledge of "${focusArea}".

RULES:
- 4 "beginner" questions, 3 "intermediate" questions, 3 "advanced" questions
- Each question has exactly 4 options, ONE correct
- Questions should test real, practical knowledge
- For tech topics, include real-world scenarios
- Make wrong answers plausible

Return ONLY valid JSON (no markdown, no code blocks):
{
  "questions": [
    {
      "question": "string",
      "difficulty": "beginner" | "intermediate" | "advanced",
      "category": "sub-category string",
      "options": [
        { "id": "a", "text": "string", "isCorrect": true/false },
        { "id": "b", "text": "string", "isCorrect": false/true },
        { "id": "c", "text": "string", "isCorrect": false/true },
        { "id": "d", "text": "string", "isCorrect": false/true }
      ]
    }
  ]
}`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Clean markdown code blocks if present
    const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim()
    const parsed = JSON.parse(cleaned)
    const rawQuestions = parsed.questions || []

    if (rawQuestions.length === 0) return null

    // Normalize questions
    const questions = rawQuestions.slice(0, 10).map((q, idx) => {
      const options = (q.options || []).map((o, i) => ({
        id: String.fromCharCode(97 + i),
        text: o.text,
        isCorrect: o.isCorrect === true,
      }))

      // Ensure exactly one correct answer
      const correctCount = options.filter((o) => o.isCorrect).length
      if (correctCount === 0 && options.length > 0) {
        options[0].isCorrect = true
      } else if (correctCount > 1) {
        let foundFirst = false
        for (const opt of options) {
          if (opt.isCorrect) {
            if (foundFirst) opt.isCorrect = false
            foundFirst = true
          }
        }
      }

      return {
        id: `q${idx + 1}`,
        question: q.question,
        difficulty: ['beginner', 'intermediate', 'advanced'].includes(q.difficulty)
          ? q.difficulty
          : idx < 4 ? 'beginner' : idx < 7 ? 'intermediate' : 'advanced',
        category: q.category || topic,
        options,
      }
    })

    return {
      quiz_title: `${subtopic || topic} Assessment`,
      quiz_description: `Test your ${subtopic || topic} knowledge with AI-generated questions`,
      questions,
    }
  } catch (e) {
    console.warn('[skill-quiz] Gemini failed:', e.message)
    return null
  }
}

async function generateWithOpenAI(focusArea, topic, subtopic) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey || apiKey === 'sk-xxx') return null

  try {
    const OpenAI = (await import('openai')).default
    const openai = new OpenAI({ apiKey })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Generate exactly 10 multiple-choice questions to assess a student's knowledge.
Create 4 "beginner", 3 "intermediate", 3 "advanced" questions.
Each question has exactly 4 options with ONE correct.
Respond with valid JSON only:
{
  "questions": [
    {
      "question": "string",
      "difficulty": "beginner"|"intermediate"|"advanced",
      "category": "string",
      "options": [
        { "id": "a", "text": "string", "isCorrect": true/false },
        { "id": "b", "text": "string", "isCorrect": true/false },
        { "id": "c", "text": "string", "isCorrect": true/false },
        { "id": "d", "text": "string", "isCorrect": true/false }
      ]
    }
  ]
}`,
        },
        { role: 'user', content: `Generate a 10-question assessment quiz for: ${focusArea}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    })

    const text = completion.choices[0]?.message?.content
    if (!text) return null

    const parsed = JSON.parse(text)
    const rawQuestions = parsed.questions || []
    if (rawQuestions.length === 0) return null

    const questions = rawQuestions.slice(0, 10).map((q, idx) => ({
      id: `q${idx + 1}`,
      question: q.question,
      difficulty: ['beginner', 'intermediate', 'advanced'].includes(q.difficulty)
        ? q.difficulty
        : idx < 4 ? 'beginner' : idx < 7 ? 'intermediate' : 'advanced',
      category: q.category || topic,
      options: (q.options || []).map((o, i) => ({
        id: String.fromCharCode(97 + i),
        text: o.text,
        isCorrect: o.isCorrect === true,
      })),
    }))

    return {
      quiz_title: `${subtopic || topic} Assessment`,
      quiz_description: `Test your ${subtopic || topic} knowledge with AI-generated questions`,
      questions,
    }
  } catch (e) {
    console.warn('[skill-quiz] OpenAI failed:', e.message)
    return null
  }
}

export async function POST(request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { topic, subtopic } = await request.json()
    if (!topic) return NextResponse.json({ error: 'Topic is required' }, { status: 400 })

    const focusArea = subtopic ? `${topic} — specifically ${subtopic}` : topic

    // Try AI providers first, then fall back to local
    let result = await generateWithGemini(focusArea, topic, subtopic)

    if (!result) {
      result = await generateWithOpenAI(focusArea, topic, subtopic)
    }

    if (!result) {
      // Local question bank — always works, no API needed
      console.log('[skill-quiz] Using local question bank (no API key configured)')
      result = generateLocalQuiz(topic, subtopic)
    }

    return NextResponse.json(result)
  } catch (e) {
    console.error('[skill-quiz] Error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to generate quiz' },
      { status: 500 }
    )
  }
}
