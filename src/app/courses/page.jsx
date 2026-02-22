import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import CoursesClient from './CoursesClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Browse Courses | LearnHub',
  description: 'Discover expert-led courses in development, design, AI, and more. Personalized recommendations powered by AI.',
};

export default async function CoursesPage() {
  noStore();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let courses = [];
  let fetchError = null;

  if (url && key) {
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await supabase
      .from('courses')
      .select('id, title, slug, description, thumbnail_url, price')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[CoursesPage] Supabase error:', error.message);
      fetchError = error.message;
    } else {
      courses = data ?? [];
    }
  } else {
    fetchError = `Missing environment variables.`;
  }

  return <CoursesClient courses={courses} fetchError={fetchError} />;
}
