// Test Firestore Connection
const fs = require('fs');
const path = require('path');

// Read .env.local file manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

// Parse environment variables
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    process.env[key.trim()] = valueParts.join('=').trim();
  }
});

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('🔍 Testing Firestore Connection...');
console.log('Project ID:', firebaseConfig.projectId);

try {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  console.log('✅ Firebase initialized successfully');
  
  // Try to access collections
  async function testFirestore() {
    try {
      console.log('\n📊 Checking Firestore collections...');
      
      // Try to get profiles collection
      const profilesSnapshot = await getDocs(collection(db, 'profiles'));
      console.log('✅ Profiles collection accessible');
      console.log(`   Found ${profilesSnapshot.size} documents`);
      
      // Try to get courses collection
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      console.log('✅ Courses collection accessible');
      console.log(`   Found ${coursesSnapshot.size} documents`);
      
      console.log('\n🎉 SUCCESS! Firestore is working properly!');
      console.log('\nNext steps:');
      console.log('1. Deploy security rules: firebase deploy --only firestore:rules');
      console.log('2. Deploy storage rules: firebase deploy --only storage:rules');
      console.log('3. Restart dev server: npm run dev');
      
    } catch (error) {
      console.error('\n❌ Firestore Error:', error.message);
      console.error('\nError Code:', error.code);
      
      if (error.code === 'permission-denied') {
        console.log('\n💡 Solution: Deploy Firestore security rules');
        console.log('   Command: firebase deploy --only firestore:rules');
      } else if (error.message.includes('NOT_FOUND')) {
        console.log('\n💡 Solution: Firestore API might still be propagating');
        console.log('   Wait 2-3 more minutes and try again');
      } else {
        console.log('\n💡 Check your Firebase configuration in .env.local');
      }
    }
  }
  
  testFirestore();
  
} catch (error) {
  console.error('❌ Firebase Initialization Error:', error.message);
  process.exit(1);
}
