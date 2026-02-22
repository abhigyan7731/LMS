'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export function EnrollButton({ courseId, isEnrolled, slug }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course_id: courseId }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Enrolled!');
      router.push(`/learn/${slug}`);
      router.refresh();
    } catch {
      toast.error('Failed to enroll');
    } finally {
      setLoading(false);
    }
  };

  if (isEnrolled) {
    return (
      <Button asChild className="w-full">
        <Link href={`/learn/${slug}`}>Go to Course</Link>
      </Button>
    );
  }

  return (
    <Button className="w-full" onClick={handleEnroll} disabled={loading}>
      {loading ? 'Enrolling...' : 'Enroll Now'}
    </Button>
  );
}
