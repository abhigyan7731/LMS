# LearnHub - Setup Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Environment Variables

Create `.env.local` in the project root with:

```env
# Clerk (required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxx
CLERK_SECRET_KEY=sk_test_xxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
SUPABASE_SERVICE_ROLE_KEY=xxxx
```

## 3. Supabase Setup

1. Go to [supabase.com](https://supabase.com) → Create project
2. In **SQL Editor**, run the migrations in order:
   - `supabase/migrations/001_initial_schema.sql` — creates tables
   - `supabase/migrations/002_seed_dummy_data.sql` — adds demo courses (React & TypeScript)

## 4. Run the Project

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 5. Test the Flow

1. **Sign Up** — Create an account
2. **Onboarding** — Choose Teacher or Student
3. **Dashboard** — You'll see your role-based dashboard
4. **Sign Out** — Use the Sign Out button (homepage) or user menu (dashboard)
5. **Sign In** — Sign back in; you stay in your selected role

### As Student
- Browse demo courses at `/courses`
- Enroll in "Introduction to React" or "TypeScript Essentials"
- Go to **Learn** to view chapters

### As Teacher
- Create courses at **My Courses**
- Use **AI Course Generator** (needs `OPENAI_API_KEY`)
