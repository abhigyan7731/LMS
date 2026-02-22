import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import Mux from '@mux/mux-node'
import { createAdminClient } from '@/lib/supabase/admin'

const mux = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET)

export async function POST(request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { chapter_id } = body
    if (!chapter_id) return NextResponse.json({ error: 'chapter_id required' }, { status: 400 })

    const supabase = createAdminClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('clerk_user_id', userId)
      .single()

    const { data: chapter } = await supabase
      .from('chapters')
      .select('course_id, courses!inner(teacher_id)')
      .eq('id', chapter_id)
      .single()

    const teacherId = chapter?.courses?.teacher_id
    if (teacherId !== profile?.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const upload = await mux.video.uploads.create({
      new_asset_settings: { playback_policy: ['public'] },
      cors_origin: '*',
    })

    return NextResponse.json({
      uploadId: upload.id,
      uploadUrl: upload.url,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Internal error' }, { status: 500 })
  }
}
