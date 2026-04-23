import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { Landing } from './pages/Landing';
import { Loading } from './pages/Loading';
import { Chat } from './pages/Chat';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { onAuthStateChanged } from './auth';

/**
 * Main App Component with React Router
 * Routes:
 * - /login → Login page (public)
 * - /dashboard → User dashboard (protected)
 * - /chat/* → Chat interface (protected)
 * - / → Landing page (public)
 */
export function App() {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('landing');
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');
  const [domain, setDomain] = useState('');
  const sessionId = useRef(`session_${Date.now()}`);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleCreateAI = (selectedTopic) => {
    setTopic(selectedTopic);
    setError('');
    setCurrentPage('loading');
  };

  const handleReady = (detectedDomain) => {
    setDomain(detectedDomain);
    setCurrentPage('chat');

    // Save to history
    const newItem = {
      topic,
      domain: detectedDomain,
      sessionId: sessionId.current,
      createdAt: Date.now()
    };

    try {
      const saved = localStorage.getItem('chatty_history');
      let history = [];
      if (saved) {
        try {
          history = JSON.parse(saved);
        } catch {
          history = [];
        }
      }

      // Add new item at top, keep max 20
      history = [newItem, ...history].slice(0, 20);
      localStorage.setItem('chatty_history', JSON.stringify(history));
    } catch (err) {
      console.error('Failed to save history:', err);
    }
  };

  const handleReset = () => {
    setCurrentPage('landing');
    setTopic('');
    setError('');
    setDomain('');
    // Generate new session ID for next assistant
    sessionId.current = `session_${Date.now()}`;
  };

  const handleError = (errMessage) => {
    setError(errMessage);
    setCurrentPage('landing');
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Original Chat App Routes */}
        <Route
          path="/"
          element={
            <div className="app">
              {error && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-100 border border-red-300 text-red-700 px-6 py-3 rounded-full text-sm shadow-md">
                  ⚠️ {error}
                </div>
              )}

              {currentPage === 'landing' && (
                <Landing onCreateAI={handleCreateAI} />
              )}
              {currentPage === 'loading' && (
                <Loading
                  topic={topic}
                  sessionId={sessionId.current}
                  onReady={handleReady}
                  onError={handleError}
                />
              )}
              {currentPage === 'chat' && (
                <Chat
                  topic={topic}
                  domain={domain}
                  sessionId={sessionId.current}
                  onReset={handleReset}
                  onError={handleError}
                />
              )}
            </div>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

App.displayName = 'App';