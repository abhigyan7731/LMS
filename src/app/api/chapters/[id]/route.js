import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function getTeacherId(userId) {
  const supabase = createAdminClient()
  const { data } = await supabase.from('profiles').select('id').eq('clerk_user_id', userId).single()
  return data?.id
}

async function canEditChapter(chapterId, teacherId) {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('chapters')
    .select('courses!inner(teacher_id)')
    .eq('id', chapterId)
    .single()
  return data?.courses?.teacher_id === teacherId
}

export async function PATCH(request, { params }) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const teacherId = await getTeacherId(userId)
    if (!teacherId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id } = await params
    if (!(await canEditChapter(id, teacherId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const updates = {}
    if (body.title !== undefined) updates.title = body.title
    if (body.description !== undefined) updates.description = body.description
    if (body.position !== undefined) updates.position = body.position
    if (body.transcript !== undefined) updates.transcript = body.transcript
    if (body.mux_playback_id !== undefined) updates.mux_playback_id = body.mux_playback_id

    const supabase = createAdminClient()
    await supabase.from('chapters').update(updates).eq('id', id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const teacherId = await getTeacherId(userId)
    if (!teacherId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id } = await params
    if (!(await canEditChapter(id, teacherId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const supabase = createAdminClient()
    await supabase.from('chapters').delete().eq('id', id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
