import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Sign up with email and password
 * Creates user in Auth and stores profile in Firestore
 */
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, {
      displayName: displayName
    });

    // Store user data in Firestore
    await saveUserToFirestore(user.uid, {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      photoURL: null,
      authProvider: 'email',
      createdAt: new Date().toISOString()
    });

    return { success: true, user };
  } catch (error) {
    const errorMessage = getErrorMessage(error.code);
    throw new Error(errorMessage);
  }
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Sync login time or basic data to Firestore
    await saveUserToFirestore(user.uid, { lastLogin: new Date().toISOString() });
    return { success: true, user };
  } catch (error) {
    const errorMessage = getErrorMessage(error.code);
    throw new Error(errorMessage);
  }
};

/**
 * Sign in with Google using popup
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if new user (doesn't exist in Firestore yet)
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      // New user - store in Firestore
      await saveUserToFirestore(user.uid, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        authProvider: 'google',
        createdAt: new Date().toISOString()
      });
    }

    return { success: true, user };
  } catch (error) {
    // Handle specific errors
    if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup blocked by browser. Please allow popups and try again.');
    } else if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Login popup was closed. Please try again.');
    } else if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('Previous login attempt is still pending.');
    }
    throw new Error(getErrorMessage(error.code));
  }
};

/**
 * Sign out current user
 */
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    throw new Error('Failed to logout: ' + error.message);
  }
};

/**
 * Get current user (synchronous - from Auth state)
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Listen to auth state changes
 * Returns cleanup function to unsubscribe
 */
export const onAuthStateChanged = (callback) => {
  return firebaseOnAuthStateChanged(auth, callback);
};

/**
 * Get user data from Firestore
 */
export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

/**
 * Save user data to Firestore
 */
const saveUserToFirestore = async (uid, userData) => {
  try {
    return await setDoc(doc(db, 'users', uid), userData, { merge: true });
  } catch (error) {
    console.error('Error saving user to Firestore:', error);
    // Don't throw - auth succeeded even if Firestore save failed
  }
};

/**
 * Convert Firebase error codes to user-friendly messages
 */
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
    'auth/invalid-email': 'Invalid email address. Please check and try again.',
    'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact support.',
    'auth/weak-password': 'Password is too weak. Please use at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/user-not-found': 'No account found with this email. Please sign up first.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/too-many-requests': 'Too many failed login attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection and try again.'
  };

  return errorMessages[errorCode] || 'An error occurred. Please try again.';
};
