'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';

interface VideoUploadProps {
  chapterId: string;
  onComplete?: () => void;
}

export function VideoUpload({ chapterId, onComplete }: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file || !file.type.startsWith('video/')) return;

    setUploading(true);
    setProgress('Getting upload URL...');
    try {
      const res = await fetch('/api/mux/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapter_id: chapterId }),
      });
      const { uploadUrl, uploadId } = await res.json();
      if (!res.ok || !uploadUrl) throw new Error('Failed to get upload URL');

      setProgress('Uploading...');
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      setProgress('Processing...');
      const completeRes = await fetch('/api/mux/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upload_id: uploadId, chapter_id: chapterId }),
      });
      if (!completeRes.ok) throw new Error('Processing failed');
      onComplete?.();
    } catch (e) {
      setProgress('Error: ' + (e instanceof Error ? e.message : 'Upload failed'));
    } finally {
      setUploading(false);
    }
  }, [chapterId, onComplete]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'video/*': ['.mp4', '.webm', '.mov'] },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
    >
      <input {...getInputProps()} />
      {uploading ? (
        <>
          <Loader2 className="h-10 w-10 mx-auto text-primary animate-spin mb-2" />
          <p className="text-sm text-muted-foreground">{progress}</p>
        </>
      ) : (
        <>
          <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm">Drop video here or click to upload</p>
          <p className="text-xs text-muted-foreground mt-1">MP4, WebM, MOV</p>
        </>
      )}
    </div>
  );
}
