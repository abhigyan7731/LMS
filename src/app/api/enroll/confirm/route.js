import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin-cjs'

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

export async function GET(request) {
  try {
    if (!stripe) return NextResponse.redirect(new URL('/courses', request.url))

    const { userId } = await auth()
    if (!userId) return NextResponse.redirect(new URL('/sign-in', request.url))

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    const slug = searchParams.get('slug')

    if (!sessionId || !slug) {
      return NextResponse.redirect(new URL('/courses', request.url))
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid') {
      return NextResponse.redirect(new URL(`/courses/${slug}`, request.url))
    }

    const courseId = session.metadata?.course_id
    const paidByUserId = session.metadata?.clerk_user_id
    if (!courseId || paidByUserId !== userId) {
      return NextResponse.redirect(new URL(`/courses/${slug}`, request.url))
    }

    const supabase = createAdminClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('clerk_user_id', userId)
      .single()

    if (!profile) return NextResponse.redirect(new URL('/onboarding', request.url))

    await supabase.from('enrollments').upsert(
      { student_id: profile.id, course_id: courseId },
      { onConflict: 'student_id,course_id' }
    )

    return NextResponse.redirect(new URL(`/learn/${slug}`, request.url))
  } catch (e) {
    console.error(e)
    return NextResponse.redirect(new URL('/courses', request.url))
  }
}
