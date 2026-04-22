import React, { useState, useRef } from 'react';
import './App.css';
import Landing from './pages/Landing';
import Loading from './pages/Loading';
import Chat from './pages/Chat';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');
  const [domain, setDomain] = useState('');
  const sessionId = useRef(`session_${Date.now()}`);

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

  return (
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
  );
}