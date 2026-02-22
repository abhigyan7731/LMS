'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { GraduationCap } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/teacher', label: 'Teacher Portal', teacherOnly: true },
  { href: '/courses', label: 'Browse Courses' },
];

export function DashboardNav({ role }) {
  const pathname = usePathname();

  const filtered = navItems.filter(
    (i) => !i.teacherOnly || role === 'teacher'
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md">
      <div className="flex h-14 items-center px-4 gap-6 max-w-7xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <GraduationCap className="h-6 w-6 text-primary" />
          LearnHub
        </Link>
        <nav className="flex items-center gap-1">
          {filtered.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}
