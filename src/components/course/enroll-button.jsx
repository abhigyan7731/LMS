'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export function EnrollButton({ courseId, isEnrolled, slug, price }) {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const numericPrice = Number(price) || 0;
  const isPaidCourse = numericPrice > 0;

  const handleEnroll = async () => {
    setLoading(true);
    try {
      if (!user) {
        router.push('/sign-in');
        setLoading(false);
        return;
      }

      const endpoint = isPaidCourse ? '/api/stripe/checkout' : '/api/enroll';
      console.log('Enroll button clicked', { courseId, endpoint, price, isPaidCourse });

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ course_id: courseId }),
      });

      const data = await res.json();
      console.log('Enroll response', { status: res.status, data });
      if (!res.ok) {
        throw new Error(data?.error || `Enrollment failed (${res.status})`);
      }

      if (isPaidCourse && data?.url) {
        window.location.href = data.url;
        return;
      }

      // Free enrollment
      toast.success('Enrolled successfully!');
      await router.push(`/learn/${slug}`);
      router.refresh();
    } catch (err) {
      console.error('Enrollment failed', err);
      toast.error(err?.message || 'Failed to start enrollment');
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
      {loading ? 'Processing...' : isPaidCourse ? 'Buy & Enroll' : 'Enroll Now'}
    </Button>
  );
}
