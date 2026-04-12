'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Loader2 } from 'lucide-react';

/**
 * UpgradeProButton — Calls /api/stripe/subscribe and redirects to Stripe Checkout.
 * Falls back to /sign-up if the user is not authenticated.
 */
export default function UpgradeProButton({ userId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleClick() {
    // If no user, redirect to sign-up
    if (!userId) {
      router.push('/sign-up');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/stripe/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Subscribe error:', err);
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="btn-3d flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-bold text-violet-700 hover:bg-violet-50 transition-all shadow-depth-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Redirecting to payment...
          </>
        ) : (
          <>
            Upgrade to Pro
            <ChevronRight className="h-4 w-4" />
          </>
        )}
      </button>
      {error && (
        <p className="mt-2 text-xs text-red-400 text-center">{error}</p>
      )}
    </div>
  );
}
