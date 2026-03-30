-- Certificates table: issued when a student completes a course
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  serial TEXT UNIQUE,
  meta JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_certificates_enrollment ON certificates(enrollment_id);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Policy: students can view their own certificates
CREATE POLICY "Users can view own certificates" ON certificates FOR SELECT USING (
  enrollment_id IN (SELECT id FROM enrollments WHERE student_id IN (SELECT id FROM profiles WHERE clerk_user_id = current_setting('app.current_user_id', true)))
);

-- Teachers can view certificates for their courses
CREATE POLICY "Teachers can view course certificates" ON certificates FOR SELECT USING (
  course_id IN (SELECT id FROM courses WHERE teacher_id IN (SELECT id FROM profiles WHERE clerk_user_id = current_setting('app.current_user_id', true)))
);
