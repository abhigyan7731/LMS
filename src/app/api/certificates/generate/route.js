import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin-cjs'

export async function POST(request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { course_id, enrollment_id, student_id } = body

    const supabase = createAdminClient()

    // Determine enrollment: allow teacher/dean to provide student_id + course_id
    let enrollmentId = enrollment_id

    if (!enrollmentId) {
      // try find enrollment for current user
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('clerk_user_id', userId)
        .single()

      if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 400 })

      const targetStudentId = student_id ?? profile.id

      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('student_id', targetStudentId)
        .eq('course_id', course_id)
        .single()

      if (!enrollment) return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 })

      enrollmentId = enrollment.id
    }

    // Check completion: count chapters vs completed progress
    const { data: chapters } = await supabase
      .from('chapters')
      .select('id')
      .eq('course_id', course_id)

    const { data: completed } = await supabase
      .from('progress')
      .select('id')
      .eq('enrollment_id', enrollmentId)
      .eq('completed', true)

    const totalChapters = (chapters ?? []).length
    const completedCount = (completed ?? []).length

    if (totalChapters === 0) return NextResponse.json({ error: 'No chapters in course' }, { status: 400 })
    if (completedCount < totalChapters) return NextResponse.json({ error: 'Course not completed' }, { status: 400 })

    // Create certificate (simple serial)
    const serial = `CERT-${Date.now().toString(36)}-${Math.floor(Math.random()*10000)}`

    const { data: cert, error: certError } = await supabase
      .from('certificates')
      .insert({ enrollment_id: enrollmentId, course_id, serial })
      .select('id, serial, issued_at')
      .single()

    if (certError) {
      console.error('Certificate insert error', certError)
      return NextResponse.json({ error: 'Could not create certificate' }, { status: 500 })
    }

    return NextResponse.json({ certificate: cert })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
