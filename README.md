# LearnHub - AI-Powered Learning Management System

A comprehensive, modern LMS built with Next.js, featuring role-based dashboards, AI course generation, auto quiz creation, and a context-aware study assistant.

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Auth:** Clerk (Teacher/Student roles)
- **Database:** Supabase (PostgreSQL, RLS, Storage)
- **Styling:** Tailwind CSS, Shadcn UI (Radix), glassmorphism
- **Video:** Mux
- **AI:** OpenAI API

## Features

### Role-Based Dashboards
- **Teacher:** Analytics (students, revenue, course count), course creation pipeline, student management
- **Student:** Enrolled courses, progress tracking, recommended courses

### Course Management (Teachers)
- AI Course Generator (topic → full syllabus)
- Manual course creation
- Drag-and-drop chapter reordering
- Rich text descriptions
- Video upload (Mux)
- Price and publishing controls

### Learning Experience (Students)
- Distraction-free video player (Mux HLS)
- Sidebar with course outline and progress
- Per-chapter Q&A discussions
- AI-generated quizzes
- AI Study Assistant (context-aware chatbot)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Mux (optional for video)
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=

# OpenAI (for AI features)
OPENAI_API_KEY=

# Clerk Webhook (optional, for profile sync on signup)
CLERK_WEBHOOK_SECRET=
```

### 3. Supabase Setup

1. Create a Supabase project.
2. Run the migration: `supabase/migrations/001_initial_schema.sql` in the SQL editor.
3. Enable Storage for course thumbnails and attachments if needed.

### 4. Clerk Setup

1. Create a Clerk application.
2. Add Clerk webhook (optional): `https://your-domain/api/webhooks/clerk`
   - Event: `user.created`
   - Creates profile in Supabase on signup

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Sign-in, Sign-up
│   ├── api/             # API routes (courses, chapters, AI, enroll, etc.)
│   ├── dashboard/       # Role-based dashboards
│   ├── learn/[slug]/    # Learning experience (video, sidebar, Q&A)
│   ├── courses/         # Browse & course detail
│   └── onboarding/      # Role selection
├── components/
│   ├── ui/              # Shadcn-style components
│   ├── course/          # Course form, editor, enroll
│   ├── dashboard/       # Teacher/Student dashboard
│   └── learn/           # Video player, discussions, AI assistant, quiz
├── lib/
│   ├── supabase/        # Client, server, admin
│   └── utils.ts
└── types/
```

## Video Upload (Mux)

For full Mux integration:

1. Create a Mux account and get API credentials.
2. Use the Direct Upload flow: create an asset, get an upload URL, and upload the file client-side.
3. Store `mux_playback_id` in the chapter record.

The video player uses HLS streaming: `https://stream.mux.com/{playbackId}.m3u8`.
