/**
 * Backend API Integration with Firebase Authentication
 * 
 * Use this to send authenticated requests to your Express backend
 * Automatically includes Firebase ID token in Authorization header
 */

import { getCurrentUser } from './auth';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Make authenticated API request with Firebase token
 * 
 * Usage:
 *   const data = await apiCall('POST', '/chat', { message: 'Hello' });
 */
export const apiCall = async (method, endpoint, data = null) => {
  try {
    const user = getCurrentUser();
    
    if (!user) {
      throw new Error('User not authenticated. Please login first.');
    }

    // Get Firebase ID token
    const token = await user.getIdToken();

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Send token to backend
      }
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

/**
 * GET request helper
 */
export const apiGet = (endpoint) => apiCall('GET', endpoint);

/**
 * POST request helper
 */
export const apiPost = (endpoint, data) => apiCall('POST', endpoint, data);

/**
 * PUT request helper
 */
export const apiPut = (endpoint, data) => apiCall('PUT', endpoint, data);

/**
 * DELETE request helper
 */
export const apiDelete = (endpoint) => apiCall('DELETE', endpoint);

/**
 * EXAMPLE: How to use in Express backend (Node.js)
 * 
 * Install Firebase Admin SDK:
 *   npm install firebase-admin
 * 
 * In your Express route:
 * 
 * const admin = require('firebase-admin');
 * const serviceAccount = require('./serviceAccountKey.json');
 * 
 * admin.initializeApp({
 *   credential: admin.credential.cert(serviceAccount)
 * });
 * 
 * // Middleware to verify Firebase token
 * const verifyToken = async (req, res, next) => {
 *   const token = req.headers.authorization?.split('Bearer ')[1];
 *   
 *   if (!token) {
 *     return res.status(401).json({ error: 'No token provided' });
 *   }
 * 
 *   try {
 *     const decodedToken = await admin.auth().verifyIdToken(token);
 *     req.user = decodedToken;
 *     next();
 *   } catch (error) {
 *     res.status(401).json({ error: 'Invalid token' });
 *   }
 * };
 * 
 * // Use in your routes
 * app.post('/api/chat', verifyToken, async (req, res) => {
 *   const userId = req.user.uid;
 *   const { message } = req.body;
 *   
 *   // Your logic here
 *   res.json({ response: 'Hello!' });
 * });
 */
