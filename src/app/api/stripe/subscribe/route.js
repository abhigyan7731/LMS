import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin-cjs'

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

/**
 * POST /api/stripe/subscribe
 * Creates a Stripe Checkout session for the Pro subscription plan ($19/month).
 * If a STRIPE_PRO_PRICE_ID env var exists, it uses that price.
 * Otherwise, it creates an ad-hoc price via price_data.
 */
export async function POST(request) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment.' },
        { status: 400 }
      )
    }

    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Please sign in to subscribe.' }, { status: 401 })
    }

    const supabase = createAdminClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('clerk_user_id', userId)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found. Complete onboarding first.' }, { status: 404 })
    }

    const origin = new URL(request.url).origin
    const proPriceId = process.env.STRIPE_PRO_PRICE_ID

    const sessionConfig = {
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: profile.email || undefined,
      metadata: {
        clerk_user_id: userId,
        plan: 'pro',
      },
      success_url: `${origin}/dashboard?subscribed=true`,
      cancel_url: `${origin}/#pricing`,
    }

    if (proPriceId) {
      // Use an existing Stripe Price ID (recommended for production)
      sessionConfig.line_items = [{ price: proPriceId, quantity: 1 }]
    } else {
      // Create an ad-hoc price for development/demo
      sessionConfig.line_items = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'LearnHub Pro',
              description: 'Unlimited AI courses, advanced analytics, full study assistant, priority support, and more.',
            },
            unit_amount: 1900, // $19.00
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ]
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    return NextResponse.json({ url: session.url })
  } catch (e) {
    console.error('[subscribe] Error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Internal error' },
      { status: 500 }
    )
  }
}
