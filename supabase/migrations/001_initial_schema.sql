-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User roles enum
CREATE TYPE user_role AS ENUM ('teacher', 'student', 'admin');

-- Profiles (sync with Clerk, extended with role)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  price DECIMAL(10, 2) DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chapters
CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  video_url TEXT,
  mux_asset_id TEXT,
  mux_playback_id TEXT,
  duration_seconds INTEGER DEFAULT 0,
  transcript TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollments
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- Progress (per chapter)
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE NOT NULL,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  watched_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  UNIQUE(enrollment_id, chapter_id)
);

-- Chapter discussions / Q&A
CREATE TABLE chapter_discussions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES chapter_discussions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quizzes (per chapter)
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT 'Chapter Quiz',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz questions
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- [{ id: string, text: string, isCorrect: boolean }]
  position INTEGER NOT NULL DEFAULT 0
);

-- Quiz attempts
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE NOT NULL,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answers JSONB, -- { questionId: selectedOptionId }
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_courses_teacher ON courses(teacher_id);
CREATE INDEX idx_courses_published ON courses(is_published);
CREATE INDEX idx_chapters_course ON chapters(course_id);
CREATE INDEX idx_chapters_position ON chapters(course_id, position);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_progress_enrollment ON progress(enrollment_id);
CREATE INDEX idx_discussions_chapter ON chapter_discussions(chapter_id);
CREATE INDEX idx_discussions_parent ON chapter_discussions(parent_id);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapter_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (clerk_user_id = current_setting('app.current_user_id', true));
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (clerk_user_id = current_setting('app.current_user_id', true));
CREATE POLICY "Service can insert profiles" ON profiles FOR INSERT WITH CHECK (true);

-- Courses: public read if published, teacher full access
CREATE POLICY "Anyone can view published courses" ON courses FOR SELECT USING (is_published = true OR teacher_id IN (SELECT id FROM profiles WHERE clerk_user_id = current_setting('app.current_user_id', true)));
CREATE POLICY "Teachers can insert courses" ON courses FOR INSERT WITH CHECK (teacher_id IN (SELECT id FROM profiles WHERE clerk_user_id = current_setting('app.current_user_id', true) AND role = 'teacher'));
CREATE POLICY "Teachers can update own courses" ON courses FOR UPDATE USING (teacher_id IN (SELECT id FROM profiles WHERE clerk_user_id = current_setting('app.current_user_id', true)));
CREATE POLICY "Teachers can delete own courses" ON courses FOR DELETE USING (teacher_id IN (SELECT id FROM profiles WHERE clerk_user_id = current_setting('app.current_user_id', true)));

-- Chapters: follow course access
CREATE POLICY "View chapters for accessible courses" ON chapters FOR SELECT USING (
  course_id IN (SELECT id FROM courses WHERE is_published = true OR teacher_id IN (SELECT id FROM profiles WHERE clerk_user_id = current_setting('app.current_user_id', true)))
);
CREATE POLICY "Teachers can manage chapters" ON chapters FOR ALL USING (
  course_id IN (SELECT id FROM courses WHERE teacher_id IN (SELECT id FROM profiles WHERE clerk_user_id = current_setting('app.current_user_id', true)))
);

-- Enrollments & Progress: students see own
CREATE POLICY "Users see own enrollments" ON enrollments FOR SELECT USING (student_id IN (SELECT id FROM profiles WHERE clerk_user_id = current_setting('app.current_user_id', true)));
CREATE POLICY "Users can enroll" ON enrollments FOR INSERT WITH CHECK (student_id IN (SELECT id FROM profiles WHERE clerk_user_id = current_setting('app.current_user_id', true)));
CREATE POLICY "Users see own progress" ON progress FOR ALL USING (
  enrollment_id IN (SELECT id FROM enrollments WHERE student_id IN (SELECT id FROM profiles WHERE clerk_user_id = current_setting('app.current_user_id', true)))
);

-- Discussions: read if enrolled, write if enrolled
CREATE POLICY "Enrolled users can view discussions" ON chapter_discussions FOR SELECT USING (
  chapter_id IN (
    SELECT c.id FROM chapters c
    JOIN enrollments e ON e.course_id = c.course_id
    JOIN profiles p ON p.id = e.student_id AND p.clerk_user_id = current_setting('app.current_user_id', true)
  )
);
CREATE POLICY "Enrolled users can post discussions" ON chapter_discussions FOR INSERT WITH CHECK (
  user_id IN (SELECT id FROM profiles WHERE clerk_user_id = current_setting('app.current_user_id', true))
);

-- Quizzes: read if enrolled
CREATE POLICY "Enrolled users can view quizzes" ON quizzes FOR SELECT USING (
  chapter_id IN (
    SELECT c.id FROM chapters c
    JOIN enrollments e ON e.course_id = c.course_id
    JOIN profiles p ON p.id = e.student_id AND p.clerk_user_id = current_setting('app.current_user_id', true)
  )
);
CREATE POLICY "Teachers can manage quizzes" ON quizzes FOR ALL USING (
  chapter_id IN (SELECT id FROM chapters WHERE course_id IN (SELECT id FROM courses WHERE teacher_id IN (SELECT id FROM profiles WHERE clerk_user_id = current_setting('app.current_user_id', true))))
);
