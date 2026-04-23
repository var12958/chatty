// Firebase Token Verification Middleware for Express Backend
// Save this in: backend/middleware/authMiddleware.js

const admin = require('firebase-admin');

/**
 * Middleware to verify Firebase ID tokens
 * Add this to protected routes in your Express backend
 * 
 * Usage:
 *   const authMiddleware = require('./middleware/authMiddleware');
 *   app.post('/api/protected-route', authMiddleware, (req, res) => {
 *     const userId = req.user.uid;
 *     // Your logic here
 *   });
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Missing or invalid Authorization header' 
      });
    }

    const token = authHeader.split('Bearer ')[1];

    // Verify token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Attach user data to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      displayName: decodedToken.name
    };

    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ 
      error: 'Invalid or expired token',
      details: error.message 
    });
  }
};

module.exports = authMiddleware;

/**
 * ================================================
 * SETUP INSTRUCTIONS FOR EXPRESS BACKEND
 * ================================================
 * 
 * 1. Install Firebase Admin SDK:
 *    npm install firebase-admin
 * 
 * 2. Download service account key from Firebase:
 *    - Go to Firebase Console → Project Settings
 *    - Go to "Service Accounts" tab
 *    - Click "Generate New Private Key"
 *    - Save the JSON file in your backend folder (e.g., serviceAccountKey.json)
 *    - ⚠️ NEVER commit this file to git!
 * 
 * 3. Add to .gitignore:
 *    serviceAccountKey.json
 * 
 * 4. Initialize Firebase Admin in your server.js:
 * 
 *    const admin = require('firebase-admin');
 *    const serviceAccount = require('./serviceAccountKey.json');
 * 
 *    admin.initializeApp({
 *      credential: admin.credential.cert(serviceAccount),
 *      databaseURL: 'YOUR_FIREBASE_DATABASE_URL' // Optional
 *    });
 * 
 * 5. Use authMiddleware on protected routes:
 * 
 *    const authMiddleware = require('./middleware/authMiddleware');
 * 
 *    // Protected route - only authenticated users
 *    app.post('/api/chat', authMiddleware, async (req, res) => {
 *      const userId = req.user.uid;
 *      const userEmail = req.user.email;
 *      
 *      // Your logic here
 *      res.json({ 
 *        message: 'Success',
 *        userId: userId 
 *      });
 *    });
 * 
 *    // Public route - no authentication needed
 *    app.get('/api/public', (req, res) => {
 *      res.json({ message: 'Public endpoint' });
 *    });
 * 
 * 6. Frontend usage (from apiClient.js):
 * 
 *    import { apiPost } from './apiClient';
 * 
 *    // This automatically includes Firebase token
 *    const response = await apiPost('/chat', { message: 'Hello' });
 * 
 * ================================================
 * ERROR HANDLING
 * ================================================
 * 
 * The middleware handles these cases:
 * - Missing Authorization header → 401 Unauthorized
 * - Invalid token format → 401 Unauthorized
 * - Expired token → 401 Unauthorized
 * - Token verification failure → 401 Unauthorized
 * 
 * Frontend will catch these errors:
 *   try {
 *     const data = await apiPost('/api/chat', payload);
 *   } catch (error) {
 *     console.error('API Error:', error);
 *   }
 * 
 * ================================================
 * SECURITY NOTES
 * ================================================
 * 
 * 1. Never expose serviceAccountKey.json to frontend
 * 2. Keep service account key in .gitignore
 * 3. Rotate keys periodically
 * 4. Use HTTPS in production
 * 5. Validate user permissions server-side
 * 6. Rate limit endpoints to prevent abuse
 * 7. Check req.user.uid on database queries to ensure users
 *    only access their own data
 */
