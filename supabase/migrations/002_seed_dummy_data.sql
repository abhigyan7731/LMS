-- Seed dummy data for demo
-- Run this AFTER 001_initial_schema.sql
-- Creates demo teacher + courses so students can browse and enroll

-- Demo teacher profile (fake clerk ID - real users get their own via onboarding)
INSERT INTO profiles (id, clerk_user_id, email, full_name, role)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'demo-teacher-seed',
  'demo@learnhub.com',
  'Demo Teacher',
  'teacher'
)
ON CONFLICT (clerk_user_id) DO NOTHING;

-- Demo courses
INSERT INTO courses (id, teacher_id, title, slug, description, price, is_published)
VALUES 
  (
    '22222222-2222-2222-2222-222222222221',
    '11111111-1111-1111-1111-111111111111',
    'Introduction to React',
    'intro-react-demo',
    'Learn the fundamentals of React - components, hooks, state management, and building modern web applications.',
    0,
    true
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'TypeScript Essentials',
    'typescript-essentials-demo',
    'Master TypeScript from basics to advanced. Type safety, interfaces, generics, and real-world patterns.',
    0,
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- Chapters for React course
INSERT INTO chapters (course_id, title, description, position)
VALUES 
  ('22222222-2222-2222-2222-222222222221', 'Getting Started', 'Setup and first component', 0),
  ('22222222-2222-2222-2222-222222222221', 'Components & Props', 'Building reusable UI', 1),
  ('22222222-2222-2222-2222-222222222221', 'Hooks Deep Dive', 'useState, useEffect, and more', 2),
  ('22222222-2222-2222-2222-222222222221', 'State Management', 'Context and Redux basics', 3);

-- Chapters for TypeScript course
INSERT INTO chapters (course_id, title, description, position)
VALUES 
  ('22222222-2222-2222-2222-222222222222', 'Types Basics', 'Primitives and type annotations', 0),
  ('22222222-2222-2222-2222-222222222222', 'Interfaces & Types', 'Defining object shapes', 1),
  ('22222222-2222-2222-2222-222222222222', 'Generics', 'Reusable type-safe code', 2);
