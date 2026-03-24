'use client';

import Link from 'next/link';
import { SignOutButton } from '@clerk/nextjs';

export default function AuthButtons({ userId }) {
  return (
    <div className="flex items-center gap-2">
      {userId ? (
        <>
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            Dashboard
          </Link>
          <SignOutButton>
            <button className="text-sm font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 transition-all shadow-md hover:shadow-violet-200 dark:hover:shadow-violet-900/40">
              Sign Out
            </button>
          </SignOutButton>
        </>
      ) : (
        <>
          <Link
            href="/sign-in"
            className="hidden sm:inline-flex text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="text-sm font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 transition-all shadow-md hover:shadow-violet-200 dark:hover:shadow-violet-900/40"
          >
            Get started
          </Link>
        </>
      )}
    </div>
  );
}
