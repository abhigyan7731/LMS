'use client'

import { useCallback } from 'react'

export function VideoPlayer({ playbackId, chapterId, enrollmentId }) {
  const onTimeUpdate = useCallback(async (time) => {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        enrollment_id: enrollmentId,
        chapter_id: chapterId,
        watched_seconds: Math.floor(time),
      }),
    })
  }, [enrollmentId, chapterId])

  const onEnded = useCallback(async () => {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        enrollment_id: enrollmentId,
        chapter_id: chapterId,
        completed: true,
      }),
    })
  }, [enrollmentId, chapterId])

  if (!playbackId) {
    return (
      <div className="w-full aspect-video bg-muted flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p>No video for this chapter yet</p>
          <p className="text-sm">Teacher will add video soon</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full aspect-video bg-black relative">
      <video
        className="w-full h-full"
        controls
        playsInline
        onTimeUpdate={(e) => onTimeUpdate(e.currentTarget.currentTime)}
        onEnded={onEnded}
      >
        <source
          src={`https://stream.mux.com/${playbackId}.m3u8`}
          type="application/x-mpegURL"
        />
      </video>
    </div>
  )
}
