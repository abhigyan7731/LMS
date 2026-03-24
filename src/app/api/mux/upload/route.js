import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import Mux from '@mux/mux-node'
import { createAdminClient } from '@/lib/supabase/admin-cjs'

const tokenId = process.env.MUX_TOKEN_ID
const tokenSecret = process.env.MUX_TOKEN_SECRET
const mux = tokenId && tokenSecret ? new Mux(tokenId, tokenSecret) : null

export async function POST(request) {
  try {
    if (!mux) {
      return NextResponse.json(
        { error: 'Mux credentials missing. Add MUX_TOKEN_ID and MUX_TOKEN_SECRET to .env.local. See MUX_SETUP.md.' },
        { status: 400 }
      )
    }

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

    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .select('course_id, courses!inner(teacher_id)')
      .eq('id', chapter_id)
      .single()

    if (chapterError || !chapter) {
      return NextResponse.json({ error: 'Chapter not found or access denied' }, { status: 404 })
    }

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
    const message = e?.message ?? (e instanceof Error ? e.message : 'Internal error')
    return NextResponse.json(
      { error: message || 'Internal error' },
      { status: 500 }
    )
  }
}
