'use client';

import { useCallback } from 'react';

interface VideoPlayerProps {
  playbackId: string | null;
  chapterId: string;
  enrollmentId: string;
  transcript?: string | null;
  onVideoEnded?: () => void;
}

export function VideoPlayer({
  playbackId,
  chapterId,
  enrollmentId,
  onVideoEnded,
}: VideoPlayerProps) {
  const onTimeUpdate = useCallback(async (time: number) => {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        enrollment_id: enrollmentId,
        chapter_id: chapterId,
        watched_seconds: Math.floor(time),
      }),
    });
  }, [enrollmentId, chapterId]);

  const onEnded = useCallback(async () => {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        enrollment_id: enrollmentId,
        chapter_id: chapterId,
        completed: true,
      }),
    });
    onVideoEnded?.();
  }, [enrollmentId, chapterId, onVideoEnded]);

  if (!playbackId) {
    return (
      <div className="w-full aspect-video bg-muted flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p>No video for this chapter yet</p>
          <p className="text-sm">Teacher will add video soon</p>
        </div>
      </div>
    );
  }

  // Using HTML5 video with Mux stream - Mux playback ID can be used with
  // mux-player or HLS.js. For simplicity we use mux-player-react if available,
  // otherwise a placeholder that documents the integration.
  return (
    <div className="w-full aspect-video bg-black relative">
      {/* Mux Player - requires NEXT_PUBLIC_MUX_DATA_ID and playbackId */}
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
  );
}
