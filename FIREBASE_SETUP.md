# Firebase Setup Guide

## 🚀 Quick Start

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "learnhub-lms")
4. Disable Google Analytics (optional for development)
5. Click "Create project"

### Step 2: Enable Firestore Database

1. In Firebase Console, click "Firestore Database" in left sidebar
2. Click "Create database"
3. Choose **"Start in test mode"** (we'll deploy secure rules later)
4. Select a location closest to your users
5. Click "Enable"

### Step 3: Enable Firebase Storage

1. In Firebase Console, click "Storage" in left sidebar
2. Click "Get started"
3. Click "Next" (start in test mode)
4. Select same location as Firestore
5. Click "Done"

### Step 4: Get Firebase Configuration

1. Go to Project Settings (gear icon ⚙️)
2. Scroll down to "Your apps" section
3. Click "</>" (Web app) icon
4. Register app with nickname "LearnHub Web"
5. Copy the `firebaseConfig` object

### Step 5: Update Environment Variables

Open `.env.local` and replace the placeholder values:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy... (from firebaseConfig)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Step 6: Install Dependencies

```bash
npm install
```

### Step 7: Deploy Security Rules

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select: Firestore, Storage
# Choose: Use existing project
# Select your project
# For Firestore rules: choose firestore.rules
# For Storage rules: choose storage.rules

# Deploy rules
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

### Step 8: Test Connection

```bash
node scripts/check_db.js
```

You should see:
```
✅ Firebase connected successfully!
📊 Firestore collections: 0 (empty - this is normal for new setup)
```

### Step 9: Create Admin User

1. Sign up at `http://localhost:3000/sign-up` with email: `abhigyankumar268@gmail.com`
2. Complete onboarding (choose Teacher or Student)
3. Access `/college` to verify Dean's Portal works

## 📋 Detailed Configuration

### Firebase Console Settings

#### Authentication (Optional - We use Clerk)
- Go to Authentication → Sign-in method
- You can disable this since we're using Clerk
- Or keep it for future Firebase Auth integration

#### Firestore Database
- Location: Choose region closest to your users
  - US: `us-central`
  - Europe: `europe-west`
  - Asia: `asia-southeast1`
  
#### Storage
- Use same location as Firestore
- Default bucket is fine for most cases

### Security Rules Deployment

After running `firebase init`, your `firebase.json` should look like:

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

### Verify Rules Are Active

1. Go to Firebase Console → Firestore Database → Rules
2. You should see the rules from `firestore.rules`
3. Check Storage → Rules for storage rules

## 🧪 Testing the Setup

### Test Profile Creation

```bash
node scripts/test_onboarding.js
```

Expected output:
```
🧪 Testing Onboarding Flow

Step 1: Creating test profile...
   User ID: test_admin_user_...
   Email: abhigyankumar268@gmail.com
   Name: Admin User
   Role: teacher

✅ Profile created successfully!

Step 2: Verifying profile...
✅ Profile verified!

📋 Profile details:
┌─────────┬──────────────────────┐
│ Field   │ Value                │
├─────────┼──────────────────────┤
│ ID      │ ...                  │
│ Clerk ID│ test_admin_user_...  │
│ Email   │ abhigyankumar...     │
│ Name    │ Admin User           │
│ Role    │ teacher              │
└─────────┴──────────────────────┘

✅ Test passed! Admin user created successfully.
```

### Test Portal Access

1. **Dean's Portal**: Visit `/college`
   - Should load instantly (no more 11-second delay!)
   - Should show dashboard if using admin email
   
2. **Teacher Portal**: Visit `/teacher`
   - Should work for teacher role users
   
3. **Student Access**: Visit `/courses`
   - Should show course catalog

## 🔧 Troubleshooting

### "Firebase not configured" error
✅ Make sure `.env.local` has all Firebase variables
✅ Restart dev server after adding variables

### "Permission denied" errors
✅ Check Firestore rules are deployed
✅ Verify user has correct role in profile

### "TypeError: fetch failed"
✅ This was a Supabase issue - Firebase should fix it
✅ Check your internet connection
✅ Verify Firebase project is active

### Port already in use
✅ Run on different port: `npm run dev -- -p 3002`

## 📊 Database Structure

After creating some data, your Firestore should have these collections:

```
Firestore/
├── profiles/          # User profiles with roles
├── courses/           # Course listings
├── chapters/          # Course chapters
├── enrollments/       # Student enrollments
├── quizzes/           # Chapter quizzes
├── quiz_attempts/     # Quiz submissions
└── discussions/       # Chapter discussions
```

## 🎯 Next Steps

1. ✅ Test all portal access controls
2. ✅ Create a test course as teacher
3. ✅ Enroll as student
4. ✅ Test quiz generation
5. ✅ Test video uploads
6. ✅ Test AI course generator

## 📞 Support Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Queries](https://firebase.google.com/docs/firestore/query-data/get-data)
- [Firebase Console](https://console.firebase.google.com/)
- [Migration Guide](FIREBASE_MIGRATION.md)

## ✅ Success Indicators

You'll know everything is working when:
- ✅ `/college` loads in < 1 second
- ✅ No "fetch failed" errors
- ✅ Can create admin user with correct email
- ✅ Dean's Portal shows all students/teachers/courses
- ✅ Teacher Portal restricts access correctly
- ✅ Student enrollment works
- ✅ All portals respect role-based access

---

**Note**: Keep your Firebase credentials secure! Never commit `.env.local` to Git.
