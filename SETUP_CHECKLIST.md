# ✅ Firebase Authentication Setup Checklist

Use this checklist to ensure everything is configured correctly.

## 📦 Installation

- [ ] Run `npm install` in project root
- [ ] Verify no npm errors
- [ ] Check package.json has firebase and react-router-dom

## 🔑 Firebase Project Setup

- [ ] Created Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
- [ ] Project name created
- [ ] Google Analytics enabled (optional)

## 🔐 Firebase Configuration

- [ ] Went to Project Settings (⚙️ icon)
- [ ] Found "Your apps" section
- [ ] Created or selected Web app
- [ ] Copied Firebase config object
- [ ] Created `.env.local` file in project root
- [ ] Added REACT_APP_FIREBASE_API_KEY
- [ ] Added REACT_APP_FIREBASE_AUTH_DOMAIN
- [ ] Added REACT_APP_FIREBASE_PROJECT_ID
- [ ] Added REACT_APP_FIREBASE_STORAGE_BUCKET
- [ ] Added REACT_APP_FIREBASE_MESSAGING_SENDER_ID
- [ ] Added REACT_APP_FIREBASE_APP_ID

## 🔓 Enable Authentication

In Firebase Console → Authentication:

- [ ] Clicked "Get Started"
- [ ] Went to "Sign-in method"
- [ ] Enabled "Email/Password"
  - [ ] Toggle "Email/Password" is ON
- [ ] Enabled "Google"
  - [ ] Toggle is ON
  - [ ] Added support email
  - [ ] Configured OAuth consent screen (if required)

## 🗄️ Create Firestore Database

In Firebase Console → Firestore Database:

- [ ] Clicked "Create Database"
- [ ] Selected "Start in test mode"
- [ ] Selected default region (us-central1 recommended)
- [ ] Database is now active

## 📁 Files Created

Frontend files:
- [ ] `src/firebase.js` exists
- [ ] `src/auth.js` exists
- [ ] `src/pages/Login.js` exists
- [ ] `src/pages/Dashboard.js` exists
- [ ] `src/components/ProtectedRoute.js` exists
- [ ] `src/apiClient.js` exists
- [ ] `src/App.js` updated with routing

Backend files:
- [ ] `backend/middleware/authMiddleware.js` exists

Configuration files:
- [ ] `.env.local` exists in root
- [ ] `.env.example` exists (reference)
- [ ] `.gitignore` has `.env.local` (if using git)

Documentation:
- [ ] `FIREBASE_SETUP.md` exists
- [ ] `QUICK_START.md` exists
- [ ] This checklist exists

## 🧪 Test the Setup

### Start Development Server
- [ ] Terminal: `npm start`
- [ ] Browser opens to localhost:3000
- [ ] No console errors

### Test Login Page
- [ ] Navigate to `http://localhost:3000/login`
- [ ] Login form displays
- [ ] Google Sign-In button visible
- [ ] Email/Password inputs visible

### Test Google Sign-In
- [ ] Click "Sign in with Google"
- [ ] Google popup opens
- [ ] Can select Google account
- [ ] After login, redirected to `/dashboard`
- [ ] Dashboard shows user info

### Test Email Signup
- [ ] On login page, click "Sign Up"
- [ ] Enter name, email, password
- [ ] Click "Create Account"
- [ ] Redirected to dashboard
- [ ] User profile displays

### Test Email Login
- [ ] Go to login page
- [ ] Stay on "Sign In" tab
- [ ] Enter email from previous signup
- [ ] Enter password
- [ ] Click "Sign In"
- [ ] Redirected to dashboard

### Test Dashboard
- [ ] Shows user name
- [ ] Shows user email
- [ ] Shows User ID
- [ ] Shows Sign In Method (Google or Email/Password)
- [ ] Shows Account Created date
- [ ] Shows Email Verified status

### Test Logout
- [ ] On dashboard, click "Logout" button
- [ ] Redirected to login page
- [ ] Can't access dashboard by going back
- [ ] Session cleared

### Test Session Persistence
- [ ] Login to app
- [ ] Refresh page (F5)
- [ ] Still on dashboard (not redirected to login)
- [ ] User info still displayed
- [ ] Close browser and reopen
- [ ] Still logged in

### Test Route Protection
- [ ] Logout
- [ ] Try to access `/dashboard` directly
- [ ] Redirected to `/login`
- [ ] Login again
- [ ] Can access `/dashboard`

## 🔍 Firestore Data

- [ ] Go to Firebase Console → Firestore
- [ ] Look for "users" collection
- [ ] Click on user document
- [ ] Verify stored data:
  - [ ] uid
  - [ ] email
  - [ ] displayName
  - [ ] authProvider
  - [ ] createdAt
  - [ ] photoURL (if Google auth)

## 🎨 UI Verification

- [ ] Login page has gradient background
- [ ] All buttons are clickable
- [ ] Form validation shows errors
- [ ] Loading spinners appear during actions
- [ ] Error messages are readable
- [ ] Dashboard displays nicely formatted user info
- [ ] Mobile responsive (test on narrow screen)

## ⚙️ Advanced (Optional)

### Backend Integration
- [ ] Installed firebase-admin: `npm install firebase-admin` (in backend folder)
- [ ] Downloaded serviceAccountKey.json
- [ ] Added to backend/.gitignore
- [ ] Initialized Firebase Admin in server.js
- [ ] Created authMiddleware.js
- [ ] Added middleware to protected routes
- [ ] Tested protected backend route with frontend call

### Environment Variables
- [ ] .env.local not committed to git
- [ ] .gitignore includes .env.local
- [ ] All env variables loaded correctly
- [ ] App works after npm start (no reload needed)

## 🚀 Ready for Production?

Before deploying:
- [ ] Updated Firestore security rules (not in test mode)
- [ ] Added your domain to Firebase Console → Authentication → Authorized domains
- [ ] Set up reCAPTCHA (optional)
- [ ] Created backend/.gitignore with serviceAccountKey.json
- [ ] Verified all env variables for production
- [ ] Tested all auth flows one more time
- [ ] Checked error handling for edge cases

## 🎉 Deployment Ready

If all boxes are checked:
- ✅ Frontend ready for deployment (npm run build)
- ✅ Backend ready with token verification
- ✅ Firestore security rules configured
- ✅ All routes protected
- ✅ User data stored securely

---

## 📞 If Something Doesn't Work

**Issue: Can't see Google Sign-In button**
- [ ] Check Firebase Console - is Google provider enabled?
- [ ] Check browser console for errors (F12)
- [ ] Try refreshing page

**Issue: Getting "Firebase config is missing"**
- [ ] Check .env.local exists in project root
- [ ] Check all REACT_APP_FIREBASE_* variables are set
- [ ] Restart npm start after updating .env.local

**Issue: Can't login with Google**
- [ ] Check OAuth provider is enabled in Firebase
- [ ] Check browser allows popups
- [ ] Look at browser console for specific error

**Issue: User data not appearing in Firestore**
- [ ] Check Firestore Database created
- [ ] Check database is in test mode (for development)
- [ ] Look for "users" collection in Firestore
- [ ] Check browser console for errors

**Issue: Session doesn't persist after refresh**
- [ ] Check Firebase persistence initialized in firebase.js
- [ ] Look for localStorage in browser dev tools
- [ ] Check browser settings - 3rd party cookies enabled?

---

**Mark items as you complete them. When all are checked, you're ready to use the auth system!** ✨
