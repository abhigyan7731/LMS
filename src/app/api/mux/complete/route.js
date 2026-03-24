import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import Mux from '@mux/mux-node'
import { createAdminClient } from '@\/lib\/supabase\/admin-cjs'

const mux = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET)

export async function POST(request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { upload_id, chapter_id } = body
    if (!upload_id || !chapter_id) {
      return NextResponse.json({ error: 'upload_id and chapter_id required' }, { status: 400 })
    }

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

    if (chapter?.courses?.teacher_id !== profile?.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const upload = await mux.video.uploads.retrieve(upload_id)
    const assetId = upload?.asset_id

    if (!assetId) {
      return NextResponse.json({ error: 'Upload not yet processed. Please wait and try again.' }, { status: 400 })
    }

    const asset = await mux.video.assets.retrieve(assetId)
    const playbackIds = asset?.playback_ids ?? []
    let playbackId = playbackIds.find((p) => p.policy === 'public')?.id

    if (!playbackId) {
      const created = await mux.video.assets.createPlaybackId(assetId, { policy: 'public' })
      playbackId = created?.id
    }

    await supabase
      .from('chapters')
      .update({
        mux_asset_id: assetId,
        mux_playback_id: playbackId,
      })
      .eq('id', chapter_id)

    return NextResponse.json({ playbackId, assetId })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Internal error' }, { status: 500 })
  }
}
