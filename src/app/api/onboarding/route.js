import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin-cjs'

export async function POST(request) {
  try {
    // Development helper: allow passing a dev Clerk user via headers for local testing.
    // Only enabled when NODE_ENV !== 'production'.
    let userId
    if (process.env.NODE_ENV !== 'production') {
      const devUser = request.headers.get('x-dev-clerk-user')
      if (devUser) {
        userId = devUser
      }
    }

    if (!userId) {
      const authResult = await auth()
      userId = authResult.userId
    }
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { role } = await request.json()
    if (!role || !['teacher', 'student'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // If dev headers provided, use them to simulate a Clerk user (local testing)
    let email = null
    let fullName = null
    let avatarUrl = null
    if (process.env.NODE_ENV !== 'production') {
      const devEmail = request.headers.get('x-dev-email')
      const devFirst = request.headers.get('x-dev-first-name')
      const devLast = request.headers.get('x-dev-last-name')
      const devImg = request.headers.get('x-dev-image')
      if (devEmail) email = devEmail
      if (devFirst || devLast) fullName = [devFirst, devLast].filter(Boolean).join(' ') || null
      if (devImg) avatarUrl = devImg
    }
    if (!email || !fullName) {
      const clerkUser = await clerkClient().users.getUser(userId)
      email = email ?? (clerkUser.emailAddresses?.[0]?.emailAddress ?? 'unknown@example.com')
      fullName = fullName ?? ([clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || null)
      avatarUrl = avatarUrl ?? (clerkUser.imageUrl ?? null)
    }

    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('clerk_user_id', userId)
      .single()

    if (existing) {
      await supabase
        .from('profiles')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
    } else {
      await supabase.from('profiles').insert({
        clerk_user_id: userId,
        email,
        full_name: fullName,
        avatar_url: avatarUrl,
        role,
      })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Onboarding error:', e)
    const message = e instanceof Error ? e.message : 'Internal error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
