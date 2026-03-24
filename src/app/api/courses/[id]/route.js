import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin-cjs'

export async function PATCH(request, { params }) {
  try {
    const DEAN_EMAIL = 'abhigyankumar268@gmail.com'
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createAdminClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('clerk_user_id', userId)
      .single()

    const { id } = await params
    const { data: course } = await supabase
      .from('courses')
      .select('teacher_id')
      .eq('id', id)
      .single()

    const isDean = profile?.email === DEAN_EMAIL
    if (!course || (!isDean && course.teacher_id !== profile?.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const updates = {}
    if (body.title !== undefined) updates.title = body.title
    if (body.description !== undefined) updates.description = body.description
    if (body.price !== undefined) updates.price = body.price
    if (body.is_published !== undefined) updates.is_published = body.is_published

    await supabase.from('courses').update(updates).eq('id', id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
