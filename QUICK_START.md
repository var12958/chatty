# 🔐 Firebase Authentication System - Quick Start

## What's Been Created

Your complete, production-ready Firebase authentication system with:
- ✅ Google Sign-In (popup)
- ✅ Email/Password signup and login
- ✅ Session persistence (survives refresh)
- ✅ User profile storage in Firestore
- ✅ Route protection (ProtectedRoute component)
- ✅ Modern, minimal UI with Tailwind CSS
- ✅ Error handling with user-friendly messages
- ✅ Backend integration ready

---

## 🚀 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create Firebase Project
1. Go to [firebase.google.com](https://firebase.google.com)
2. Click **Go to console**
3. Click **Create project**
4. Enter project name, follow setup

### Step 3: Get Firebase Config
1. In Firebase Console, click **⚙️ Project Settings**
2. Scroll to **Your apps** → **Web**
3. Copy the config object (looks like below)

### Step 4: Create `.env.local` File
Create file in root of project (same level as package.json):

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxx
REACT_APP_FIREBASE_AUTH_DOMAIN=my-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=my-project
REACT_APP_FIREBASE_STORAGE_BUCKET=my-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:xxxxxxxxxxxxxx
```

### Step 5: Enable Firebase Services
In Firebase Console:

**Authentication:**
1. Click **Authentication** → **Get Started**
2. Click **Sign-in method**
3. Enable: **Email/Password** and **Google**
4. For Google, add your support email

**Firestore:**
1. Click **Firestore Database** → **Create Database**
2. Choose **Start in test mode** (for development)
3. Choose default location (us-central1)

### Step 6: Start App
```bash
npm start
```

Visit [http://localhost:3000/login](http://localhost:3000/login) ✅

---

## 📍 File Locations

| File | Purpose |
|------|---------|
| `src/firebase.js` | Firebase config |
| `src/auth.js` | Auth functions |
| `src/pages/Login.js` | Login/signup UI |
| `src/pages/Dashboard.js` | User profile (protected) |
| `src/components/ProtectedRoute.js` | Route protection |
| `src/apiClient.js` | Backend API calls |
| `backend/middleware/authMiddleware.js` | Express token verification |

---

## 🎯 Routes

| Route | Status | Purpose |
|-------|--------|---------|
| `/login` | Public | Login/signup page |
| `/dashboard` | Protected | User profile |
| `/` | Public | Your landing page |

---

## 💻 Code Examples

### Use in Components

```javascript
import { signInWithGoogle, logout, getCurrentUser, getUserData } from './auth';
import ProtectedRoute from './components/ProtectedRoute';

// Get current user
const user = getCurrentUser();

// Listen to auth changes
import { onAuthStateChanged } from './auth';

useEffect(() => {
  const unsubscribe = onAuthStateChanged((user) => {
    if (user) {
      console.log('Logged in:', user.email);
    } else {
      console.log('Logged out');
    }
  });
  return () => unsubscribe();
}, []);
```

### Protect Routes

```javascript
<Route
  path="/my-page"
  element={
    <ProtectedRoute>
      <MyPage />
    </ProtectedRoute>
  }
/>
```

### Call Protected Backend

```javascript
import { apiPost } from './apiClient';

// Automatically includes Firebase token
const response = await apiPost('/api/chat', { message: 'Hello' });
```

---

## 🔧 Backend Integration (Optional)

If you want to protect your Express routes:

1. **Install Firebase Admin:**
   ```bash
   cd backend
   npm install firebase-admin
   ```

2. **Download service key:**
   - Firebase Console → Project Settings → Service Accounts
   - Generate and download JSON key
   - Save as `backend/serviceAccountKey.json`
   - Add to `.gitignore`

3. **Initialize in server.js:**
   ```javascript
   const admin = require('firebase-admin');
   const serviceAccount = require('./serviceAccountKey.json');

   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount)
   });
   ```

4. **Use middleware on routes:**
   ```javascript
   const authMiddleware = require('./middleware/authMiddleware');
   
   app.post('/api/chat', authMiddleware, (req, res) => {
     const userId = req.user.uid;
     // Your code here
   });
   ```

See `backend/middleware/authMiddleware.js` for full documentation.

---

## 🚨 Troubleshooting

**Error: "Firebase config is missing"**
- Ensure `.env.local` exists in project root
- Restart dev server after updating .env
- Check values match Firebase config

**Google Sign-In not working**
- Verify Google enabled in Firebase Console
- Check browser console for errors
- Allow popups in browser settings

**User data not saving**
- Check Firestore Database created
- Verify test mode rules active
- Check browser console errors

**"Unauthorized" errors from backend**
- Verify Firebase Admin initialized
- Check serviceAccountKey.json file path
- Ensure token sent in Authorization header

---

## 📚 Full Documentation

See `FIREBASE_SETUP.md` for detailed setup and advanced configuration.

---

## ⚡ What Works Out of the Box

✅ Log in with Google (popup)  
✅ Sign up with email  
✅ Log in with email  
✅ Logout  
✅ View profile after login  
✅ Session persists on refresh  
✅ Protected routes redirect to login  
✅ User data stored in Firestore  
✅ Error messages shown to user  
✅ Loading states  
✅ Modern UI  

---

## 🎨 Customization

### Change Login UI Colors
Edit `src/pages/Login.js` - Change Tailwind classes (bg-blue-500, etc.)

### Add User Fields
Edit `src/auth.js` → `saveUserToFirestore()` function

### Extend Dashboard
Edit `src/pages/Dashboard.js` - Add more user info sections

### Custom Routes
Edit `src/App.js` - Add more Route components

---

## 📞 Support

- [Firebase Docs](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com)
- [React Router Docs](https://reactrouter.com)

---

**Ready to test?** Run `npm start` and navigate to `/login` 🎉
