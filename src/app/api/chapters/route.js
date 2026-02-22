import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createAdminClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('clerk_user_id', userId)
      .single()

    const body = await request.json()
    const { course_id, title, description, position } = body

    if (!course_id || !title) {
      return NextResponse.json({ error: 'course_id and title required' }, { status: 400 })
    }

    const { data: course } = await supabase
      .from('courses')
      .select('teacher_id')
      .eq('id', course_id)
      .single()

    if (!course || course.teacher_id !== profile?.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: chapter, error } = await supabase
      .from('chapters')
      .insert({
        course_id,
        title,
        description: description || null,
        position: position ?? 0,
      })
      .select('id')
      .single()

    if (error) throw error
    return NextResponse.json({ id: chapter.id })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
