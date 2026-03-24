/**
 * Seed script: Insert dummy courses into Supabase
 * 
 * Usage:
 *   node scripts/seed-courses.js
 * 
 * Requires env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing env vars: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const DUMMY_COURSES = [
  {
    title: 'Full-Stack Web Development with React & Node.js',
    slug: 'fullstack-react-node',
    description: 'Master modern full-stack development. Build real-world applications using React for the frontend and Node.js/Express for the backend. Covers REST APIs, authentication, databases, and deployment.',
    category: 'Web Development',
    price: 49.99,
    is_published: true,
    thumbnail_url: null,
  },
  {
    title: 'Python for Data Science & Machine Learning',
    slug: 'python-data-science-ml',
    description: 'Learn Python from scratch and dive into data science. Covers NumPy, Pandas, Matplotlib, Scikit-learn, and real-world ML projects with hands-on exercises.',
    category: 'Data Science',
    price: 59.99,
    is_published: true,
    thumbnail_url: null,
  },
  {
    title: 'UI/UX Design Masterclass',
    slug: 'uiux-design-masterclass',
    description: 'Learn the principles of modern UI/UX design. From wireframing to high-fidelity prototypes using Figma. Includes design systems, accessibility, and portfolio projects.',
    category: 'Design',
    price: 39.99,
    is_published: true,
    thumbnail_url: null,
  },
  {
    title: 'Cloud Computing with AWS – From Zero to Hero',
    slug: 'cloud-aws-zero-to-hero',
    description: 'Get certified-ready with this comprehensive AWS course. Covers EC2, S3, Lambda, DynamoDB, CloudFormation, and best practices for cloud architecture.',
    category: 'Cloud Computing',
    price: 69.99,
    is_published: true,
    thumbnail_url: null,
  },
  {
    title: 'Mobile App Development with Flutter',
    slug: 'mobile-flutter-dev',
    description: 'Build beautiful cross-platform mobile apps with Flutter and Dart. Covers widgets, state management, Firebase integration, and App Store deployment.',
    category: 'Mobile Development',
    price: 44.99,
    is_published: true,
    thumbnail_url: null,
  },
  {
    title: 'Introduction to Cybersecurity',
    slug: 'intro-cybersecurity',
    description: 'Understand the fundamentals of cybersecurity. Covers network security, ethical hacking basics, cryptography, and security best practices for developers.',
    category: 'Cybersecurity',
    price: 34.99,
    is_published: true,
    thumbnail_url: null,
  },
  {
    title: 'Advanced JavaScript – Deep Dive',
    slug: 'advanced-javascript-deep-dive',
    description: 'Go beyond the basics of JavaScript. Covers closures, prototypes, async patterns, event loop, TypeScript integration, and performance optimization.',
    category: 'Web Development',
    price: 29.99,
    is_published: true,
    thumbnail_url: null,
  },
  {
    title: 'Database Design & SQL Mastery',
    slug: 'database-design-sql',
    description: 'Master relational database design and SQL. Covers normalization, complex queries, indexing, stored procedures, and working with PostgreSQL and MySQL.',
    category: 'Databases',
    price: 24.99,
    is_published: true,
    thumbnail_url: null,
  },
];

async function seed() {
  console.log('🌱 Seeding dummy courses into Supabase...\n');

  // First, check if a teacher profile exists to assign courses to
  const { data: teacher } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'teacher')
    .limit(1)
    .single();

  let teacherId = teacher?.id ?? null;

  // If no teacher exists, we can still insert courses without teacher_id
  if (!teacherId) {
    console.log('⚠️  No teacher profile found. Courses will have no teacher assigned.\n');
  } else {
    console.log(`✅ Using teacher profile: ${teacherId}\n`);
  }

  let inserted = 0;
  let skipped = 0;

  for (const course of DUMMY_COURSES) {
    // Check if course with this slug already exists
    const { data: existing } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', course.slug)
      .single();

    if (existing) {
      console.log(`   ⏩ Skipped "${course.title}" (already exists)`);
      skipped++;
      continue;
    }

    const { error } = await supabase.from('courses').insert({
      ...course,
      teacher_id: teacherId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error(`   ❌ Failed to insert "${course.title}":`, error.message);
    } else {
      console.log(`   ✅ Inserted "${course.title}"`);
      inserted++;
    }
  }

  console.log(`\n🎉 Done! Inserted: ${inserted}, Skipped: ${skipped}`);
}

seed().catch((err) => {
  console.error('Seed script failed:', err);
  process.exit(1);
});
