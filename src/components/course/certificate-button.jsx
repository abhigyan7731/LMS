'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function CertificateButton({ courseId, enrollmentId, slug, isCompleted }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course_id: courseId, enrollment_id: enrollmentId })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      const certId = data.certificate?.id
      if (certId) {
        router.push(`/courses/${slug}/certificate?cert_id=${certId}`)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isCompleted) {
    return <div className="text-sm text-white/60">Complete all chapters to earn a certificate.</div>
  }

  return (
    <div>
      <button
        className="w-full inline-flex items-center justify-center px-4 py-2 rounded-full bg-emerald-600 text-white text-sm font-semibold"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Get Certificate'}
      </button>
      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
    </div>
  )
}
