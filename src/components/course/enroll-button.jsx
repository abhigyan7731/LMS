'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export function EnrollButton({ courseId, isEnrolled, slug, price }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    setLoading(true);
    try {
      const endpoint = Number(price) > 0 ? '/api/stripe/checkout' : '/api/enroll';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course_id: courseId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      toast.success('Enrolled!');
      router.push(`/learn/${slug}`);
      router.refresh();
    } catch {
      toast.error('Failed to start enrollment');
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
      {loading ? 'Processing...' : Number(price) > 0 ? 'Buy & Enroll' : 'Enroll Now'}
    </Button>
  );
}
