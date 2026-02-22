const fs = require('fs');
const path = require('path');
const env = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf-8');
env.split('\n').forEach(l => {
    const t = l.trim();
    if (!t || t.startsWith('#')) return;
    const i = t.indexOf('=');
    if (i < 0) return;
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[k]) process.env[k] = v;
});
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
async function run() {
    const { data: courses, error } = await s.from('courses').select('title,is_published,price');
    if (error) { console.log('COURSES ERROR:', error.message); }
    else { console.log('COURSES COUNT:', courses.length); courses.forEach(c => console.log(' -', c.title, '| published:', c.is_published, '| price:', c.price)); }
    const { data: profiles, error: pe } = await s.from('profiles').select('full_name,role,clerk_user_id');
    if (pe) { console.log('PROFILES ERROR:', pe.message); }
    else { console.log('PROFILES COUNT:', profiles.length); profiles.forEach(p => console.log(' -', p.full_name, '|', p.role, '|', p.clerk_user_id)); }
}
run();
