# Firebase Migration Guide

## Overview
Migrated from Supabase (PostgreSQL) to Firebase (Firestore) for database operations while keeping Clerk for authentication.

## ✅ What Changed

### Removed
- ❌ Supabase client libraries (`@supabase/supabase-js`, `@supabase/ssr`)
- ❌ PostgreSQL connection pooling
- ❌ Direct SQL queries

### Added
- ✅ Firebase SDK (`firebase`)
- ✅ Firestore for NoSQL database
- ✅ Firebase Storage for file uploads
- ✅ New database abstraction layer

## 📁 New File Structure

```
src/lib/
├── firebase.js          # Firebase app initialization
├── firestore.js         # Firestore helper functions
└── supabase/
    └── admin.js         # Backward-compatible admin client (now uses Firebase)
```

## 🔧 Database Schema (Firestore)

### Collections

#### 1. `profiles`
```javascript
{
  clerk_user_id: string,      // From Clerk authentication
  email: string,
  full_name: string,
  avatar_url: string | null,
  role: 'student' | 'teacher',
  created_at: Timestamp,
  updated_at: Timestamp
}
```

#### 2. `courses`
```javascript
{
  title: string,
  slug: string,
  description: string,
  teacher_id: string,         // References profiles.id
  thumbnail_url: string | null,
  price: number,
  is_published: boolean,
  created_at: Timestamp,
  updated_at: Timestamp
}
```

#### 3. `chapters`
```javascript
{
  course_id: string,          // References courses.id
  title: string,
  content: string,
  video_url: string | null,
  mux_asset_id: string | null,
  order: number,
  is_free: boolean,
  created_at: Timestamp
}
```

#### 4. `enrollments`
```javascript
{
  student_id: string,         // References profiles.id
  course_id: string,          // References courses.id
  enrolled_at: Timestamp,
  completed: boolean
}
```

#### 5. `quizzes`
```javascript
{
  chapter_id: string,         // References chapters.id
  questions: array,
  passing_score: number,
  created_at: Timestamp
}
```

#### 6. `quiz_attempts`
```javascript
{
  quiz_id: string,            // References quizzes.id
  user_id: string,            // References profiles.id
  answers: array,
  score: number,
  passed: boolean,
  attempted_at: Timestamp
}
```

#### 7. `discussions`
```javascript
{
  chapter_id: string,         // References chapters.id
  user_id: string,            // References profiles.id
  message: string,
  created_at: Timestamp
}
```

## 🔑 Environment Variables

Update `.env.local`:

```bash
# REMOVE old Supabase variables
# NEXT_PUBLIC_SUPABASE_URL=...
# SUPABASE_SERVICE_ROLE_KEY=...

# ADD Firebase configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Keep Clerk (unchanged)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## 🚀 Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Enable Firebase Storage (for file uploads)
5. Get your config from Project Settings
6. Update `.env.local` with Firebase credentials

### 3. Set Up Firestore Rules

Create `firestore.rules`:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Profiles - users can read all, update own
    match /profiles/{profileId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == resource.data.clerk_user_id;
      allow update: if request.auth != null && request.auth.uid == resource.data.clerk_user_id;
    }
    
    // Courses - public read, teacher write
    match /courses/{courseId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        exists(/databases/$(database)/documents/profiles/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/profiles/$(request.auth.uid)).data.role == 'teacher';
    }
    
    // Chapters - follow course permissions
    match /chapters/{chapterId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Enrollments - authenticated users
    match /enrollments/{enrollmentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == resource.data.student_id;
    }
    
    // Quizzes - students can read, teachers write
    match /quizzes/{quizId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Quiz attempts
    match /quiz_attempts/{attemptId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
    
    // Discussions
    match /discussions/{discussionId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && request.auth.uid == resource.data.user_id;
    }
  }
}
```

### 4. Deploy Rules
```bash
firebase deploy --only firestore:rules
```

## 📝 Code Changes

### Before (Supabase)
```javascript
import { createAdminClient } from '@/lib/supabase/admin';

const supabase = createAdminClient();
const { data: profile } = await supabase
  .from('profiles')
  .select('id, role, email')
  .eq('clerk_user_id', userId)
  .single();
```

### After (Firebase)
```javascript
import { createAdminClient } from '@/lib/supabase/admin';

const supabase = createAdminClient();
const { data: profile } = await supabase
  .from('profiles')
  .select('id, role, email')
  .where('clerk_user_id', '==', userId);
```

**Note**: The API is designed to be backward-compatible. Most existing code should work without changes!

## ⚠️ Breaking Changes

### 1. Query Syntax
- Supabase: `.eq('field', value)`
- Firebase wrapper: `.where('field', '==', value)`

### 2. Complex Queries
Firestore has limitations:
- Maximum 10 values in `in` operator
- No OR queries without Collection Groups
- Requires composite indexes for some queries

### 3. Real-time Subscriptions
If you were using Supabase subscriptions, you'll need to implement Firestore `onSnapshot` listeners.

## 🧪 Testing

### Check Database Connection
```bash
node scripts/check_db.js
```

### Create Test Admin User
```bash
node scripts/test_onboarding.js
```

## 🎯 Benefits

✅ **No more connection issues** - Firebase uses HTTP/HTTPS  
✅ **Better scalability** - Automatic scaling with Google infrastructure  
✅ **Offline support** - Built-in caching for client apps  
✅ **Real-time updates** - Native real-time listeners  
✅ **Easier development** - No SQL migrations needed  

## 🐛 Troubleshooting

### "TypeError: fetch failed"
This was the Supabase issue. Firebase should resolve this as it uses standard HTTPS.

### Firestore Index Errors
Check the error message - it will provide a link to create the required index automatically.

### Permission Denied
Verify Firestore rules are deployed correctly and user roles are set properly.

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/manage-data/structure-data)
- [Firebase vs Supabase Comparison](https://firebase.google.com/docs/firestore)

## ✅ Migration Checklist

- [ ] Install Firebase dependencies
- [ ] Create Firebase project
- [ ] Enable Firestore
- [ ] Enable Storage
- [ ] Update environment variables
- [ ] Deploy Firestore rules
- [ ] Test database connection
- [ ] Create admin user
- [ ] Test all portals (Dean, Teacher, Student)
- [ ] Verify course creation works
- [ ] Test enrollment flow
- [ ] Test quiz generation
