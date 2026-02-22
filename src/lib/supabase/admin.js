import { createClient } from '@supabase/supabase-js';

function createNoopClient() {
  console.warn('Supabase not configured — returning noop supabase client');
  const proxyHandler = {
    get() {
      return () => Promise.resolve({ data: null, error: null });
    },
  };
  const from = () => new Proxy(() => {}, proxyHandler);
  return new Proxy({ from }, {
    get(target, prop) {
      if (prop === 'from') return target.from;
      return () => Promise.resolve({ data: null, error: null });
    },
  });
}

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return createNoopClient();
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
