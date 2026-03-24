const { createAdminClient } = require('../src/lib/supabase/admin-cjs');

async function check() {
    console.log('🔍 Checking Firebase connection...\n');
    
    const supabase = createAdminClient();
    
    try {
        // Test profiles collection
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('id, full_name, role, clerk_user_id');
        
        if (error) {
            console.error('❌ Firebase error:', error);
            return;
        }
        
        console.log(`✅ Firebase connected successfully!`);
        console.log(`\n📊 Total profiles in DB: ${profiles?.length ?? 0}`);
        
        if (profiles && profiles.length > 0) {
            profiles.forEach(p => {
                console.log(`  - [${p.role}] ${p.full_name} (${p.clerk_user_id?.substring(0, 20)}...)`);
            });
        } else {
            console.log('  (No profiles yet - this is normal for new setup)');
        }
        
        // Test other collections
        const collections = ['courses', 'chapters', 'enrollments'];
        console.log('\n📁 Collections:');
        for (const col of collections) {
            try {
                const { data } = await supabase.from(col).select('id');
                const count = data?.length ?? 0;
                console.log(`  - ${col}: ${count} documents`);
            } catch (err) {
                console.log(`  - ${col}: Not created yet`);
            }
        }
        
    } catch (err) {
        console.error('❌ Connection error:', err.message);
        console.log('\n💡 Make sure you:');
        console.log('   1. Created a Firebase project');
        console.log('   2. Enabled Firestore Database');
        console.log('   3. Updated .env.local with Firebase credentials');
        console.log('   4. Restarted the dev server');
    }
}

check().catch(console.error);
