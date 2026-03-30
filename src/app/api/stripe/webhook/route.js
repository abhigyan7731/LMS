import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin-cjs'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || null

export async function POST(request) {
	try {
		const payload = await request.text()
		const sig = request.headers.get('stripe-signature')

		let event = null
		if (stripe && webhookSecret) {
			try {
				event = stripe.webhooks.constructEvent(payload, sig, webhookSecret)
			} catch (err) {
				console.error('Webhook signature verification failed.', err?.message)
				return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
			}
		} else {
			// Allow unsigned events in development for easier testing with stripe CLI
			if (process.env.NODE_ENV === 'production') {
				console.error('Stripe or webhook secret not configured')
				return NextResponse.json({ error: 'Stripe not configured' }, { status: 400 })
			}
			try {
				event = JSON.parse(payload)
				console.warn('Processing unsigned webhook in dev mode')
			} catch (err) {
				console.error('Failed to parse unsigned webhook payload', err?.message)
				return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
			}
		}

		if (event.type === 'checkout.session.completed') {
			const session = event.data?.object || event
			const courseId = session.metadata?.course_id
			const clerkUserId = session.metadata?.clerk_user_id

			console.log('Webhook checkout.session.completed', { courseId, clerkUserId, sessionId: session.id })

			if (courseId && clerkUserId) {
				const supabase = createAdminClient()
				const { data: profile } = await supabase
					.from('profiles')
					.select('id')
					.eq('clerk_user_id', clerkUserId)
					.single()

				if (profile) {
					const { data: existing } = await supabase
						.from('enrollments')
						.select('id')
						.eq('student_id', profile.id)
						.eq('course_id', courseId)
						.single()

					if (!existing) {
						await supabase.from('enrollments').insert({ student_id: profile.id, course_id: courseId })
						console.log('Enrollment created for', profile.id, 'course', courseId)
					} else {
						console.log('Enrollment already exists for', profile.id, 'course', courseId)
					}
				} else {
					console.warn('No profile found for clerk_user_id', clerkUserId)
				}
			} else {
				console.warn('Webhook session missing metadata', { session })
			}
		}

		return NextResponse.json({ received: true })
	} catch (e) {
		console.error('Stripe webhook handler error', e)
		return NextResponse.json({ error: 'Internal error' }, { status: 500 })
	}
}
