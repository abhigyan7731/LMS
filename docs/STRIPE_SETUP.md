# Stripe Setup & Local Testing

This document explains how to obtain and add the `STRIPE_WEBHOOK_SECRET` and test Stripe Checkout locally.

1. Retrieve the webhook signing secret
   - Open the Stripe Dashboard → Developers → Webhooks.
   - Add an endpoint or click an existing one and copy the **Signing secret** (starts with `whsec_`).

2. Add to local environment
   - Create a file named `.env.local` in the project root (do NOT commit it).
   - Add the following (use your test keys):

```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

3. Start your app

```bash
npm run dev
```

4. Forward Stripe webhooks to your local app (Stripe CLI)

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

5. Test a Checkout session
   - From the app, sign in as a test student and click "Buy & Enroll" on a paid course.
   - Complete payment with Stripe test card `4242 4242 4242 4242`.
   - Alternatively, trigger a test event from Stripe CLI:

```bash
stripe trigger checkout.session.completed
```

6. Verify
   - In Stripe Dashboard → Developers → Logs, confirm delivery and HTTP 2xx response.
   - Check your server logs for `webhook` handling messages and confirm an enrollment record was created in Supabase.

7. Production
   - Add `STRIPE_WEBHOOK_SECRET` to your production environment variables (Vercel/Netlify/Heroku) through their UI.
   - Configure Stripe webhook endpoint URL to `https://<your-domain>/api/stripe/webhook` and subscribe to `checkout.session.completed`.

Security notes
   - Never commit `.env.local` or secrets to git.
   - Use different keys for test and production environments.
