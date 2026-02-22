import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const chapterId = searchParams.get('chapter_id')
    if (!chapterId) return NextResponse.json({ error: 'chapter_id required' }, { status: 400 })

    const supabase = createAdminClient()
    const { data: quiz } = await supabase
      .from('quizzes')
      .select('id')
      .eq('chapter_id', chapterId)
      .single()

    if (!quiz) return NextResponse.json({ questions: null })

    const { data: questions } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quiz.id)
      .order('position')

    return NextResponse.json({ questions: questions ?? [] })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
