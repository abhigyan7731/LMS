import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin-cjs'
import { auth } from '@clerk/nextjs/server'

export default async function CertificatePage({ params, searchParams }) {
  const { slug } = params
  const certId = searchParams?.cert_id

  if (!certId) return (<div className="p-8">Certificate ID missing</div>)

  const supabase = createAdminClient()

  const { data: certificate } = await supabase
    .from('certificates')
    .select('id, serial, issued_at, enrollment_id, course_id')
    .eq('id', certId)
    .single()

  if (!certificate) notFound()

  // fetch related data
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('student_id')
    .eq('id', certificate.enrollment_id)
    .single()

  const { data: student } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', enrollment.student_id)
    .single()

  const { data: course } = await supabase
    .from('courses')
    .select('title')
    .eq('id', certificate.course_id)
    .single()

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-3xl w-full bg-white text-black p-12 rounded-lg shadow-lg print:p-8">
        <h2 className="text-2xl font-bold text-center">Certificate of Completion</h2>
        <p className="text-center text-sm text-gray-600 mt-2">This certifies that</p>
        <h1 className="text-center text-3xl font-semibold mt-6">{student?.full_name}</h1>
        <p className="text-center text-sm text-gray-600 mt-3">has successfully completed the course</p>
        <h2 className="text-center text-xl font-medium mt-2">{course?.title}</h2>
        <div className="mt-8 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">Issued</div>
            <div className="text-sm">{new Date(certificate.issued_at).toLocaleDateString()}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Certificate ID</div>
            <div className="text-sm font-mono">{certificate.serial}</div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white rounded">Print / Save as PDF</button>
        </div>
      </div>
    </div>
  )
}
