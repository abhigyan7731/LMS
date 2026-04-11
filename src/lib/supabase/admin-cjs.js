// Supabase admin client for server-side operations
const { createClient } = require('@supabase/supabase-js');
// Ensure a stable fetch implementation in Node (fixes "TypeError: fetch failed")
try {
  if (typeof globalThis.fetch === 'undefined') {
    // undici provides a modern fetch for Node
    // require dynamically to avoid issues in environments where undici isn't available
    // (we add it as a dependency in package.json)
    globalThis.fetch = require('undici').fetch;
  }
} catch (e) {
  // Non-fatal: leave fetch as-is and let supabase client fail with existing error
}

function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required'
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

module.exports = { createAdminClient };
