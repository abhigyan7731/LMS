# Quick Setup Guide - Admin & Portals

## ✅ What Was Fixed

1. **Dean's Portal** (`/college`) - No longer redirects to onboarding incorrectly
2. **Teacher Portal** (`/teacher`) - Properly checks for teacher role
3. **Student Portal** (`/student`) - Works for teachers and admin only
4. **Sign-in Flow** - Redirects to homepage instead of dashboard

## 🚀 How to Set Up Admin Access

### Step 1: Create Admin Account
1. Go to `http://localhost:3000`
2. Click "Sign Up" or go to `/sign-up`
3. Use this email: **abhigyankumar268@gmail.com**
4. Complete the sign-up process

### Step 2: Complete Onboarding
1. After signing up, you'll be redirected to onboarding
2. Choose either "Teacher" or "Student" (doesn't matter which)
3. Click Continue

### Step 3: Access Dean's Portal
Once onboarding is complete:
- Navigate to `/college` to access the Dean's Portal
- You can now view:
  - All students (`/college/students`)
  - All teachers (`/college/teachers`)
  - All courses (`/college/courses`)

## 🔐 Access Rules

| Portal | Who Can Access | URL |
|--------|---------------|-----|
| **Dean's Portal** | Email = abhigyankumar268@gmail.com | `/college` |
| **Teacher Portal** | Role = teacher | `/teacher` |
| **Student Management** | Teachers + Admin | `/student` |
| **Course Catalog** | Everyone | `/courses` |

## 🧪 Testing Different Roles

### Test as Admin
```
Email: abhigyankumar268@gmail.com
Access: /college, /student, all public pages
```

### Test as Teacher
```
Email: any other email
Role: teacher (during onboarding)
Access: /teacher, /student (your students only)
```

### Test as Student
```
Email: any other email
Role: student (during onboarding)
Access: /courses, /learn/[course]
```

## 🛠️ Verify Database

Check current users in database:
```bash
node scripts/fix_admin_email.js
```

This shows:
- Whether admin email exists
- All profiles in database
- Their roles and emails

## 📋 Common Issues

### Issue: "Redirects to onboarding even after completing it"
**Solution**: This was fixed! The layouts now properly handle database errors. Try again with a fresh sign-up.

### Issue: "Can't access Dean's Portal"
**Solution**: Make sure you're using the exact email: `abhigyankumar268@gmail.com`

### Issue: "Teacher can't see students"
**Solution**: Teachers need to create courses first. Students appear here only when they enroll in your courses.

## 🎯 Next Steps

1. ✅ Sign up as admin using the email above
2. ✅ Complete onboarding
3. ✅ Test all portals work correctly
4. ✅ Create some test courses and students
5. ✅ Verify all access controls work as expected

## 💳 Testing Stripe Payments Locally

1. Add these env values to your local `.env` (use test keys):

```
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

2. Start your dev server (Next):

```bash
npm run dev
```

3. Use the Stripe CLI to forward webhooks to your local app:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

4. In the app, sign in as a student, open a paid course and click "Buy & Enroll". Complete checkout with a Stripe test card (e.g. `4242 4242 4242 4242`).

5. After payment you should be redirected into the course and an enrollment record will be created (webhook used as fallback).

## 📞 Support

If you encounter any issues:
1. Run `node scripts/fix_admin_email.js` to check database state
2. Check browser console for errors
3. Verify `.env` file has correct Supabase credentials
4. Make sure Clerk authentication is working
