import { unstable_noStore as noStore } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin-cjs';
import CoursesClient from './CoursesClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Browse Courses | LearnHub',
  description: 'Discover expert-led courses in development, design, AI, and more. Personalized recommendations powered by AI.',
};

export default async function CoursesPage() {
  noStore();

  let courses = [];
  let fetchError = null;

  try {
    const supabase = createAdminClient();
    const { auth } = await import('@clerk/nextjs/server');
    const { userId } = await auth();

    let profileId = null;
    if (userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('clerk_user_id', userId)
        .single();
      profileId = profile?.id ?? null;
    }

    let query = supabase
      .from('courses')
      .select('id, title, slug, description, thumbnail_url, price, is_published, teacher_id')
      .order('created_at', { ascending: false });

    // Public users see only published courses.
    // Logged-in creators also see their own drafts.
    if (profileId) {
      query = query.or(`is_published.eq.true,teacher_id.eq.${profileId}`);
    } else {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query;

    if (error) throw error;
    courses = data || [];
  } catch (err) {
    console.error('[CoursesPage] Firestore error:', err.message);
    fetchError = err.message;
  }

  return <CoursesClient courses={courses} fetchError={fetchError} />;
}
