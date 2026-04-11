/**
 * Supabase Admin Client (ESM version)
 * Uses service role key for server-side operations with full access
 */

import { createClient } from '@supabase/supabase-js';
// Ensure a stable fetch implementation in Node (fixes "TypeError: fetch failed")
try {
  if (typeof globalThis.fetch === 'undefined') {
    // undici provides a modern fetch for Node
    // dynamic import to avoid ESM/CJS interop issues during build
    const undici = await import('undici');
    globalThis.fetch = undici.fetch;
  }
} catch (e) {
  // Non-fatal: fall back to environment-provided fetch if available
}

let adminClient = null;

export function createAdminClient() {
  if (adminClient) return adminClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required'
    );
  }

  adminClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}
