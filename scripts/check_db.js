const fs = require('fs');
const path = require('path');

// Parse .env
const envContent = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf-8');
envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx < 0) return;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
});

const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('URL:', url ? url.substring(0, 40) + '...' : '❌ MISSING');
console.log('KEY:', key ? key.substring(0, 20) + '...' : '❌ MISSING');

if (!url || !key) process.exit(1);

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function check() {
    const { data: courses, error } = await supabase
        .from('courses')
        .select('id, title, is_published, price')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('\n❌ Supabase error:', error.message);
        return;
    }

    console.log(`\n📚 Total courses in DB: ${courses?.length ?? 0}`);
    courses?.forEach(c => {
        console.log(`  - [${c.is_published ? '✅ published' : '⬜ draft'}] ${c.title} ($${c.price})`);
    });

    const { data: profiles } = await supabase.from('profiles').select('id, full_name, role, clerk_user_id');
    console.log(`\n👥 Total profiles in DB: ${profiles?.length ?? 0}`);
    profiles?.forEach(p => console.log(`  - [${p.role}] ${p.full_name} (${p.clerk_user_id?.substring(0, 20)})`));
}

check().catch(console.error);
