import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { enrollment_id, chapter_id, watched_seconds, completed } = body

    if (!enrollment_id || !chapter_id) {
      return NextResponse.json({ error: 'enrollment_id and chapter_id required' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('clerk_user_id', userId)
      .single()

    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('student_id')
      .eq('id', enrollment_id)
      .single()

    if (!enrollment || enrollment.student_id !== profile?.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const existing = await supabase
      .from('progress')
      .select('id')
      .eq('enrollment_id', enrollment_id)
      .eq('chapter_id', chapter_id)
      .single()

    if (existing.data) {
      await supabase
        .from('progress')
        .update({
          watched_seconds: watched_seconds ?? undefined,
          completed: completed ?? undefined,
          completed_at: completed ? new Date().toISOString() : undefined,
        })
        .eq('id', existing.data.id)
    } else {
      await supabase.from('progress').insert({
        enrollment_id,
        chapter_id,
        watched_seconds: watched_seconds ?? 0,
        completed: completed ?? false,
        completed_at: completed ? new Date().toISOString() : null,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
