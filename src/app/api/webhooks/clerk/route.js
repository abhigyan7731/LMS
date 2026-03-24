import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { createAdminClient } from '@\/lib\/supabase\/admin-cjs'

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) return new Response('Webhook secret missing', { status: 500 })

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing headers', { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    })
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  if (evt.type === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data
    const email = email_addresses?.[0]?.email_address ?? 'unknown@example.com'
    const fullName = [first_name, last_name].filter(Boolean).join(' ') || null

    const supabase = createAdminClient()
    await supabase.from('profiles').insert({
      clerk_user_id: id,
      email,
      full_name: fullName,
      avatar_url: image_url ?? null,
      role: 'student',
    })
  }

  return new Response('OK', { status: 200 })
}
