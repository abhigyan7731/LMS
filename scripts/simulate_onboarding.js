const fs = require('fs');
const path = require('path');
// try to load dotenv if available, otherwise parse .env manually
try {
  require('dotenv').config();
} catch (e) {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split(/\r?\n/).forEach((line) => {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) {
        let val = m[2];
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[m[1]] = val;
      }
    });
  }
}

const { createClient } = require('@supabase/supabase-js');

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const clerkUserId = process.argv[2] || 'simulated-user-1';
  const role = process.argv[3] || 'teacher';

  console.log(`Upserting profile for clerk_user_id=${clerkUserId} role=${role}`);

  // try to find existing
  const { data: existing, error: selErr } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', clerkUserId)
    .maybeSingle();

  if (selErr) {
    console.error('Select error:', selErr);
    process.exit(1);
  }

  if (existing && existing.id) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', existing.id);
    if (error) {
      console.error('Update error:', error);
      process.exit(1);
    }
    console.log('Updated profile:', data);
    return;
  }

  const payload = {
    clerk_user_id: clerkUserId,
    email: `${clerkUserId}@example.com`,
    full_name: 'Simulated User',
    avatar_url: null,
    role,
  };

  const { data: insData, error: insErr } = await supabase.from('profiles').insert(payload).select();
  if (insErr) {
    console.error('Insert error:', insErr);
    process.exit(1);
  }
  console.log('Inserted profile:', insData);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
