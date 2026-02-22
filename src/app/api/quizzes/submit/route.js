import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { chapter_id, enrollment_id, answers } = body

    if (!chapter_id || !answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'chapter_id and answers required' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data: quiz } = await supabase
      .from('quizzes')
      .select('id')
      .eq('chapter_id', chapter_id)
      .single()

    if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })

    const { data: questions } = await supabase
      .from('quiz_questions')
      .select('id, options')
      .eq('quiz_id', quiz.id)

    let correct = 0
    for (const q of questions ?? []) {
      const opts = q.options ?? []
      const correctOpt = opts.find((o) => o.isCorrect)
      const selected = answers[q.id]
      if (correctOpt && selected === correctOpt.id) correct++
    }

    const total = questions?.length ?? 0

    if (enrollment_id) {
      await supabase.from('quiz_attempts').insert({
        enrollment_id,
        quiz_id: quiz.id,
        score: correct,
        total_questions: total,
        answers,
      })
    }

    return NextResponse.json({ score: correct, total })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
