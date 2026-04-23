import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser, getUserData } from '../auth';

/**
 * Dashboard Component - Shows user profile after authentication
 * Protected route - only accessible to authenticated users
 */
export function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get current user
    const currentUser = getCurrentUser();
    
    if (currentUser) {
      setUser(currentUser);
      
      // Fetch user data from Firestore
      const fetchUserData = async () => {
        try {
          const data = await getUserData(currentUser.uid);
          setUserData(data);
        } catch (err) {
          console.error('Error loading user data:', err);
          setError('Failed to load user data');
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    } else {
      // User not logged in - redirect to login
      navigate('/login');
    }
  }, [navigate]);

  /**
   * Handle Logout
   */
  const handleLogout = async () => {
    setIsSigningOut(true);
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Logout failed');
      setIsSigningOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg font-semibold">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <button
            onClick={handleLogout}
            disabled={isSigningOut}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningOut ? 'Signing out...' : 'Logout'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* User Profile Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h2>

          <div className="space-y-6">
            {/* Avatar */}
            {(user?.photoURL || userData?.photoURL) && (
              <div className="flex justify-center mb-6">
                <img
                  src={user?.photoURL || userData?.photoURL}
                  alt="User Avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                />
              </div>
            )}

            {/* User Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Name
                </label>
                <p className="text-lg text-gray-900 font-semibold break-words">
                  {user?.displayName || userData?.displayName || 'Not set'}
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Email
                </label>
                <p className="text-lg text-gray-900 font-semibold break-all">
                  {user?.email}
                </p>
              </div>

              {/* UID */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  User ID
                </label>
                <p className="text-sm text-gray-700 font-mono break-all bg-gray-100 p-3 rounded-lg">
                  {user?.uid}
                </p>
              </div>

              {/* Auth Provider */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Sign In Method
                </label>
                <p className="text-lg text-gray-900 font-semibold">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {userData?.authProvider === 'google' ? 'Google' : 'Email/Password'}
                  </span>
                </p>
              </div>

              {/* Account Created */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Account Created
                </label>
                <p className="text-lg text-gray-900 font-semibold">
                  {userData?.createdAt
                    ? new Date(userData.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Unknown'}
                </p>
              </div>

              {/* Email Verified */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Email Verified
                </label>
                <p className="text-lg font-semibold">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${
                      user?.emailVerified
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {user?.emailVerified ? '✓ Verified' : 'Pending'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-8" />

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="p-4 bg-gradient-to-br from-blue-100 to-blue-50 hover:from-blue-200 hover:to-blue-100 border border-blue-200 rounded-lg transition-colors">
                <p className="font-semibold text-gray-900">Start Chatting</p>
                <p className="text-sm text-gray-600">Chat with AI about any topic</p>
              </button>

              <button className="p-4 bg-gradient-to-br from-purple-100 to-purple-50 hover:from-purple-200 hover:to-purple-100 border border-purple-200 rounded-lg transition-colors">
                <p className="font-semibold text-gray-900">View History</p>
                <p className="text-sm text-gray-600">See your previous conversations</p>
              </button>
            </div>
          </div>
        </div>

        {/* Session Info */}
        <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-6 text-white">
          <p className="text-sm opacity-80">
            You are securely logged in. Your session will persist even after refreshing the page or closing your browser.
          </p>
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = 'Dashboard';
