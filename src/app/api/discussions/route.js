import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@\/lib\/supabase\/admin-cjs'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const chapterId = searchParams.get('chapter_id')
    if (!chapterId) return NextResponse.json({ error: 'chapter_id required' }, { status: 400 })

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('chapter_discussions')
      .select('id, content, user_id, created_at')
      .eq('chapter_id', chapterId)
      .is('parent_id', null)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data ?? [])
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { chapter_id, content } = body
    if (!chapter_id || !content) {
      return NextResponse.json({ error: 'chapter_id and content required' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('clerk_user_id', userId)
      .single()

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    const { data, error } = await supabase
      .from('chapter_discussions')
      .insert({
        chapter_id,
        user_id: profile.id,
        content,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
