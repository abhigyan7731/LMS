'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!role) return;
    setLoading(true);
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        const msg = data.error || data.message || `Request failed (${res.status})`;
        toast.error(msg);
        throw new Error(msg);
      }
    } catch (err) {
      if (err instanceof Error && !err.message.startsWith('Request failed')) {
        toast.error(err.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-accent/5">
      <Card className="w-full max-w-md border-white/20 bg-white/10 dark:bg-white/5 backdrop-blur-glass shadow-glass">
        <CardHeader>
          <CardTitle>Welcome{user?.firstName ? `, ${user.firstName}` : ''}</CardTitle>
          <CardDescription>Choose how you&apos;ll use LearnHub</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>I am a...</Label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={`flex flex-col items-center gap-2 p-6 rounded-lg border-2 transition-all ${
                role === 'teacher'
                  ? 'border-primary bg-primary/10'
                  : 'border-muted hover:border-primary/50'
              }`}
            >
              <BookOpen className="h-10 w-10 text-primary" />
              <span className="font-medium">Teacher</span>
              <span className="text-xs text-muted-foreground text-center">
                Create and manage courses
              </span>
            </button>
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex flex-col items-center gap-2 p-6 rounded-lg border-2 transition-all ${
                role === 'student'
                  ? 'border-primary bg-primary/10'
                  : 'border-muted hover:border-primary/50'
              }`}
            >
              <GraduationCap className="h-10 w-10 text-primary" />
              <span className="font-medium">Student</span>
              <span className="text-xs text-muted-foreground text-center">
                Enroll and learn
              </span>
            </button>
          </div>
          <Button
            type="button"
            className="w-full"
            onClick={handleSubmit}
            disabled={!role || loading}
          >
            {loading ? 'Saving...' : 'Continue'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
