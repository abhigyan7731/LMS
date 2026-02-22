import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import OpenAI from 'openai'
import { randomUUID } from 'crypto'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { chapter_id, transcript } = body

    if (!chapter_id) return NextResponse.json({ error: 'chapter_id required' }, { status: 400 })

    const content = (transcript || 'No content').slice(0, 6000)

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Generate a multiple-choice quiz with 3-5 questions based on the given content. Each question has 4 options, exactly one correct.
Respond with valid JSON only:
{
  "questions": [
    {
      "question": "string",
      "options": [
        { "text": "string", "isCorrect": true/false }
      ]
    }
  ]
}
For each option, add "id" as a unique string (e.g. "a", "b", "c", "d").`,
        },
        { role: 'user', content },
      ],
      response_format: { type: 'json_object' },
    })

    const text = completion.choices[0]?.message?.content
    if (!text) throw new Error('No response from AI')

    const parsed = JSON.parse(text)

    const questions = (parsed.questions ?? []).map((q, idx) => ({
      id: randomUUID(),
      question: q.question,
      position: idx,
      options: (q.options ?? []).map((o, i) => ({
        id: String.fromCharCode(97 + i),
        text: o.text,
        isCorrect: o.isCorrect ?? false,
      })),
    }))

    const supabase = createAdminClient()
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
    console.error(e)
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Internal error' }, { status: 500 })
  }
}
