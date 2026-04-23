# Firebase Authentication Setup Guide

## 🚀 Quick Start

This authentication system is ready to use! Follow these steps to get started:

### 1. **Install Dependencies**
```bash
npm install
```
(Firebase is already added to package.json)

### 2. **Configure Firebase**

#### A. Create Firebase Project (if you don't have one)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create project"
3. Enter project name and follow the setup wizard
4. Enable Google Analytics (optional)

#### B. Get Firebase Config
1. In Firebase Console, click **Project Settings** (⚙️ gear icon)
2. Go to **Your apps** section
3. Click **Create app** or select existing web app
4. Choose **Web** as platform
5. Copy the configuration object

#### C. Set Environment Variables
1. Create `.env.local` file in your project root (same level as package.json)
2. Copy content from `.env.example` and fill in your Firebase config:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyDxxx...
REACT_APP_FIREBASE_AUTH_DOMAIN=my-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=my-project
REACT_APP_FIREBASE_STORAGE_BUCKET=my-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:xxx
```

#### D. Enable Authentication Methods in Firebase
1. In Firebase Console, go to **Authentication**
2. Click **Get Started** → **Sign-in method**
3. Enable these providers:
   - **Email/Password** - Click enable, toggle "Email/Password" on
   - **Google** - Click Google, toggle on, add support email

#### E. Create Firestore Database
1. In Firebase Console, go to **Firestore Database**
2. Click **Create Database**
3. Select **Start in test mode** (for development)
   - ⚠️ Important: Change to production rules before deploying to production
4. Choose default region (us-central1 recommended)

#### F. Set Firestore Security Rules (for production)
Go to **Firestore → Rules** and paste:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write only their own user document
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

### 3. **Start Development Server**
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 File Structure

```
src/
├── firebase.js              # Firebase initialization & config
├── auth.js                  # Authentication functions
├── App.js                   # Main app with routing
├── pages/
│   ├── Login.js            # Login/Sign-up page
│   ├── Dashboard.js        # User profile dashboard (protected)
│   ├── Landing.js          # (your existing page)
│   ├── Chat.js             # (your existing page)
│   └── Loading.js          # (your existing page)
└── components/
    └── ProtectedRoute.js   # Route protection component
```

---

## 🔐 Features Included

### ✅ Authentication Methods
- **Google Sign-In** (popup)
- **Email/Password Signup**
- **Email/Password Login**
- **Logout**

### ✅ Session Management
- Automatic session persistence (survives page refresh)
- Real-time auth state monitoring
- Secure token handling

### ✅ User Data Storage
- User profile stored in Firestore
- Stores: UID, email, name, provider, creation date
- Photo URL support (for Google auth)

### ✅ Route Protection
- `ProtectedRoute` component prevents unauthorized access
- Automatic redirect to login for non-authenticated users
- Loading state while checking authentication

### ✅ Error Handling
- User-friendly error messages
- Google-specific error handling (popup blocked, etc.)
- Form validation

### ✅ UI/UX
- Minimal, modern design
- Loading states with spinners
- Responsive layout
- Tailwind CSS styling
- Light/dark mode ready

---

## 📖 Usage

### How to Use the Authentication System

#### 1. **Access Login Page**
Navigate to `/login` - Shows login and signup forms with Google button

#### 2. **Sign In with Google**
- Click "Sign in with Google" button
- Popup opens for Google authentication
- On success, user redirected to `/dashboard`

#### 3. **Sign Up with Email**
- Click "Sign Up" tab on login page
- Enter name, email, password
- Confirm password
- Account created automatically

#### 4. **Sign In with Email**
- On login page, stay on "Sign In" tab
- Enter email and password
- Click "Sign In" button

#### 5. **View Dashboard**
- After login, user sees `/dashboard`
- Shows profile info: name, email, UID, auth method
- Logout button at top right

#### 6. **Logout**
- Click "Logout" button on dashboard
- Redirects to login page

---

## 🔑 API Reference

### Authentication Functions (from `auth.js`)

```javascript
// Import in your components
import { 
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  logout,
  getCurrentUser,
  onAuthStateChanged,
  getUserData
} from './auth';

// Usage examples:
await signInWithGoogle();
await signInWithEmail('user@email.com', 'password');
await signUpWithEmail('user@email.com', 'password', 'User Name');
await logout();

const currentUser = getCurrentUser(); // Returns current user or null

// Listen to auth changes
const unsubscribe = onAuthStateChanged((user) => {
  if (user) {
    console.log('User logged in:', user);
  } else {
    console.log('User logged out');
  }
});
// unsubscribe() to stop listening

// Get user data from Firestore
const userData = await getUserData(user.uid);
```

### Component: ProtectedRoute

```javascript
// Wrap components that require authentication
import ProtectedRoute from './components/ProtectedRoute';

<Route
  path="/protected"
  element={
    <ProtectedRoute>
      <YourComponent />
    </ProtectedRoute>
  }
/>
```

---

## 🚨 Common Issues

### Issue: "Firebase config is missing" or blank values
**Solution:** Ensure `.env.local` file exists and has correct values. Restart dev server after updating `.env.local`.

### Issue: Google Sign-In not working
**Solution:** 
1. Verify Google OAuth provider is enabled in Firebase Console
2. Add your domain to authorized redirect URIs
3. Check browser console for specific error

### Issue: User data not saving to Firestore
**Solution:**
1. Verify Firestore is initialized
2. Check Firestore security rules allow write access
3. Ensure user is authenticated before writing

### Issue: "Popup blocked by browser"
**Solution:** 
- Popup blocked in iframe or non-user-initiated context
- Only works on user-triggered events (clicks)
- Browser privacy settings may block it

---

## 🔄 Production Deployment

Before deploying to production:

1. **Update Firestore Security Rules** (see Setup section)
2. **Set Node environment:**
   ```bash
   npm run build
   ```
3. **Add verified domain** to Firebase Console → Authentication → Sign-in method → Authorized domains
4. **Enable reCAPTCHA** (optional, for enhanced security)
5. **Review Firebase pricing** (free tier included)

---

## 📚 Additional Resources

- [Firebase Console](https://console.firebase.google.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [React Router Docs](https://reactrouter.com)

---

## ✨ What's Next?

1. **Customize Login UI** - Modify Login.js to match your branding
2. **Extend User Profile** - Add more fields to user data in Firestore
3. **Add Email Verification** - Send verification emails
4. **Add Password Reset** - Implement forgot password flow
5. **Add Profile Picture Upload** - Store images in Firebase Storage
6. **Integrate with Backend** - Connect to your Express server in `backend/`

---

**Ready to use!** Start your dev server and test the authentication system. 🎉
