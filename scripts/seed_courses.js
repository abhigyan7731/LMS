// seed_courses.js — Inserts dummy published courses into Supabase
// Run with: node scripts/seed_courses.js

const fs = require('fs');
const path = require('path');

// Manually parse .env file
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx < 0) return;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
});

const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function seed() {
    console.log('🌱 Seeding dummy data...\n');

    // 1. Dummy teacher profile
    const TEACHER_CLERK_ID = 'demo-teacher-seed';
    const TEACHER_ID = '11111111-1111-1111-1111-111111111111';

    const { error: profileErr } = await supabase.from('profiles').upsert({
        id: TEACHER_ID,
        clerk_user_id: TEACHER_CLERK_ID,
        email: 'demo@learnhub.com',
        full_name: 'Demo Teacher',
        role: 'teacher',
    }, { onConflict: 'clerk_user_id' });

    if (profileErr) console.error('Profile error:', profileErr.message);
    else console.log('✅ Teacher profile upserted');

    // 2. Courses
    const courses = [
        {
            id: '22222222-2222-2222-2222-222222222221',
            teacher_id: TEACHER_ID,
            title: 'Introduction to React',
            slug: 'intro-react-demo',
            description: 'Learn the fundamentals of React — components, hooks, state management, and building modern web applications from scratch.',
            price: 0,
            is_published: true,
            thumbnail_url: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&q=80',
        },
        {
            id: '22222222-2222-2222-2222-222222222222',
            teacher_id: TEACHER_ID,
            title: 'TypeScript Essentials',
            slug: 'typescript-essentials-demo',
            description: 'Master TypeScript from basics to advanced patterns. Type safety, interfaces, generics, and real-world applications.',
            price: 29.99,
            is_published: true,
            thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
        },
        {
            id: '22222222-2222-2222-2222-222222222223',
            teacher_id: TEACHER_ID,
            title: 'Full-Stack Next.js Development',
            slug: 'fullstack-nextjs-demo',
            description: 'Build production-ready full-stack apps with Next.js 14, App Router, Server Components, and Supabase as your backend.',
            price: 49.99,
            is_published: true,
            thumbnail_url: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80',
        },
        {
            id: '22222222-2222-2222-2222-222222222224',
            teacher_id: TEACHER_ID,
            title: 'Python for Data Science',
            slug: 'python-data-science-demo',
            description: 'From Python basics to machine learning. Covers NumPy, Pandas, Matplotlib, Scikit-learn, and real data projects.',
            price: 39.99,
            is_published: true,
            thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
        },
        {
            id: '22222222-2222-2222-2222-222222222225',
            teacher_id: TEACHER_ID,
            title: 'UI/UX Design Fundamentals',
            slug: 'uiux-design-demo',
            description: 'Learn user-centered design, Figma, wireframing, prototyping, and how to create stunning interfaces that users love.',
            price: 19.99,
            is_published: true,
            thumbnail_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
        },
    ];

    const { error: coursesErr } = await supabase.from('courses').upsert(courses, { onConflict: 'slug' });
    if (coursesErr) console.error('Courses error:', coursesErr.message);
    else console.log(`✅ ${courses.length} courses upserted`);

    // 3. Chapters
    const chapters = [
        // React course
        { course_id: '22222222-2222-2222-2222-222222222221', title: 'Getting Started with React', description: 'Setup your environment and build your first component', position: 0 },
        { course_id: '22222222-2222-2222-2222-222222222221', title: 'Components & Props', description: 'Building reusable, composable UI components', position: 1 },
        { course_id: '22222222-2222-2222-2222-222222222221', title: 'React Hooks Deep Dive', description: 'useState, useEffect, useRef, useMemo and more', position: 2 },
        { course_id: '22222222-2222-2222-2222-222222222221', title: 'State Management', description: 'Context API and introduction to Redux', position: 3 },
        // TypeScript course
        { course_id: '22222222-2222-2222-2222-222222222222', title: 'TypeScript Basics', description: 'Primitives, type annotations and the type system', position: 0 },
        { course_id: '22222222-2222-2222-2222-222222222222', title: 'Interfaces & Types', description: 'Defining and using object shapes', position: 1 },
        { course_id: '22222222-2222-2222-2222-222222222222', title: 'Generics', description: 'Write reusable, type-safe code', position: 2 },
        { course_id: '22222222-2222-2222-2222-222222222222', title: 'Advanced Patterns', description: 'Utility types, decorators, and real-world patterns', position: 3 },
        // Next.js course
        { course_id: '22222222-2222-2222-2222-222222222223', title: 'Next.js App Router', description: 'Understanding the new App Router and Server Components', position: 0 },
        { course_id: '22222222-2222-2222-2222-222222222223', title: 'Data Fetching', description: 'Server-side data fetching, caching and revalidation', position: 1 },
        { course_id: '22222222-2222-2222-2222-222222222223', title: 'Authentication with Clerk', description: 'Full user auth with Clerk in Next.js', position: 2 },
        { course_id: '22222222-2222-2222-2222-222222222223', title: 'Deploying to Vercel', description: 'CI/CD, environment variables, and production deployment', position: 3 },
        // Python course
        { course_id: '22222222-2222-2222-2222-222222222224', title: 'Python Basics', description: 'Variables, loops, functions and data structures', position: 0 },
        { course_id: '22222222-2222-2222-2222-222222222224', title: 'NumPy & Pandas', description: 'Data manipulation and analysis', position: 1 },
        { course_id: '22222222-2222-2222-2222-222222222224', title: 'Data Visualization', description: 'Matplotlib and Seaborn charts', position: 2 },
        // UI/UX course
        { course_id: '22222222-2222-2222-2222-222222222225', title: 'Design Principles', description: 'Color theory, typography and layout basics', position: 0 },
        { course_id: '22222222-2222-2222-2222-222222222225', title: 'Figma Mastery', description: 'Wireframes, components and prototyping in Figma', position: 1 },
        { course_id: '22222222-2222-2222-2222-222222222225', title: 'User Research', description: 'User interviews, personas and usability testing', position: 2 },
    ];

    const { error: chapsErr } = await supabase.from('chapters').upsert(chapters, { onConflict: 'id', ignoreDuplicates: true });
    if (chapsErr) {
        // chapters may not have a unique slug; just insert and ignore conflicts
        // Try insert approach instead
        for (const ch of chapters) {
            const { error } = await supabase.from('chapters').insert(ch);
            if (error && !error.message.includes('duplicate')) {
                console.error('Chapter insert error:', error.message);
            }
        }
        console.log('✅ Chapters inserted (duplicates skipped)');
    } else {
        console.log(`✅ ${chapters.length} chapters upserted`);
    }

    console.log('\n🎉 Seeding complete! Refresh /courses to see the dummy courses.');
}

seed().catch(console.error);
