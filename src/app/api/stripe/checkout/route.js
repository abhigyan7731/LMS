import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin-cjs'

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

export async function POST(request) {
  try {
    console.log('Incoming Stripe checkout POST', { url: request.url })
    if (!stripe) {
      console.error('Stripe not configured: STRIPE_SECRET_KEY missing')
      return NextResponse.json({ error: 'Stripe is not configured' }, { status: 400 })
    }

    const { userId } = await auth()
    console.log('Checkout auth result userId:', userId)
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    console.log('Checkout body:', body)
    const { course_id } = body
    if (!body) console.error('checkout POST received empty body')
    if (!course_id) return NextResponse.json({ error: 'course_id required' }, { status: 400 })

    const supabase = createAdminClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('clerk_user_id', userId)
      .single()

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    const { data: course } = await supabase
      .from('courses')
      .select('id, title, slug, description, price, is_published')
      .eq('id', course_id)
      .single()

    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    if (!course.is_published) return NextResponse.json({ error: 'Course is not published' }, { status: 400 })

    if (Number(course.price) <= 0) {
      return NextResponse.json({ error: 'This course is free. Use direct enrollment.' }, { status: 400 })
    }

    const origin = new URL(request.url).origin
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: profile.email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.title,
              description: course.description || 'Course enrollment',
            },
            unit_amount: Math.round(Number(course.price) * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        course_id: course.id,
        clerk_user_id: userId,
      },
      success_url: `${origin}/api/enroll/confirm?session_id={CHECKOUT_SESSION_ID}&slug=${course.slug}`,
      cancel_url: `${origin}/courses/${course.slug}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Internal error' }, { status: 500 })
  }
}
