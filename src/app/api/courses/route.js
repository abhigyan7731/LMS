import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@\/lib\/supabase\/admin-cjs'
import { slugify } from '@/lib/utils'

export async function POST(request) {
  try {
    const DEAN_EMAIL = 'abhigyankumar268@gmail.com'
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createAdminClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, role, email')
      .eq('clerk_user_id', userId)
      .single()

    const isDean = profile?.email === DEAN_EMAIL
    if (!profile || (!isDean && profile.role !== 'teacher')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, price, is_published } = body

    if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 })

    const slug = slugify(title) + '-' + Date.now().toString(36)

    const { data: course, error } = await supabase
      .from('courses')
      .insert({
        teacher_id: profile.id,
        title,
        slug,
        description: description || null,
        price: parseFloat(price) || 0,
        is_published: is_published ?? false,
      })
      .select('id')
      .single()

    if (error) throw error
    return NextResponse.json({ id: course.id })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
