import React, { useState, useEffect } from 'react';

const EXAMPLE_TOPICS = [
  'Python for Beginners',
  'Stock Trading Basics',
  'Cooking Italian Food',
  'Web Development',
  'Machine Learning',
  'Fitness & Nutrition',
  'Digital Photography',
  'Personal Finance'
];

/**
 * Landing Component - Home page showing topic selection
 */
export function Landing({ onCreateAI }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('chatty_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(Array.isArray(parsed) ? parsed : []);
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const handleCreateClick = () => {
    if (!input.trim()) {
      setError('Please enter a topic first');
      return;
    }
    if (input.trim().length < 3) {
      setError('Topic is too short — be more specific');
      return;
    }
    setError('');
    onCreateAI(input.trim());
  };

  const handleChipClick = (topic) => {
    setInput(topic);
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      handleCreateClick();
    }
  };

  const clearHistory = () => {
    if (window.confirm('Clear all chat history?')) {
      setHistory([]);
      localStorage.removeItem('chatty_history');
    }
  };

  const handleHistoryClick = (item) => {
    setInput(item.topic);
    setError('');
  };

  return (
    <div className="fade-in w-screen h-screen flex overflow-hidden bg-white">

      {/* LEFT SIDEBAR — HISTORY */}
      <div className="w-60 border-r border-gray-200 flex flex-col bg-gray-50">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 text-sm">History</h2>
        </div>

        {/* History Items */}
        <div className="flex-1 overflow-y-auto p-3">
          {history.length === 0 ? (
            <p className="text-xs text-gray-400 mt-4">No history yet</p>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <button
                  key={item.sessionId}
                  onClick={() => handleHistoryClick(item)}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {item.topic}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {item.domain}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear History Button */}
        {history.length > 0 && (
          <div className="border-t border-gray-200 p-3">
            <button
              onClick={clearHistory}
              className="w-full text-xs text-gray-600 hover:text-red-600 transition-colors duration-200 py-2"
            >
              Clear History
            </button>
          </div>
        )}
      </div>

      {/* RIGHT MAIN AREA */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 overflow-y-auto">
        <div className="max-w-2xl w-full">

          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="text-xs font-medium tracking-widest text-green-600 bg-green-50 border border-green-200 px-4 py-1.5 rounded-full">
              ✦ DOMAIN-LOCKED AI ASSISTANT
            </span>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-6xl font-bold mb-4 gradient-text leading-tight">
              Your AI.<br />Your Topic.<br />Nothing Else.
            </h1>
            <p className="text-lg text-gray-500 font-light mx-auto">
              Build a focused AI assistant that answers only within your chosen subject — no distractions, no irrelevant answers.
            </p>
          </div>

          {/* Input Section */}
          <div className="mb-3">
            <input
              type="text"
              className="glass-input text-lg shadow-lg w-full"
              placeholder="What do you want your AI to focus on?"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm mt-2 ml-1">{error}</p>
            )}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center mb-10">
            <button
              className={`glass-btn text-lg pulse-glow transition-all duration-300 ${
                input.trim() ? 'opacity-100' : 'opacity-50'
              }`}
              onClick={handleCreateClick}
              disabled={!input.trim()}
            >
              ✨ Build My AI Assistant
            </button>
          </div>

          {/* Example Topics */}
          <div>
            <p className="text-xs text-gray-400 mb-3 font-medium tracking-widest text-center">
              QUICK START — CLICK TO TRY
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {EXAMPLE_TOPICS.map((topic) => (
                <button
                  key={topic}
                  className={`chip hover:scale-105 transition-all duration-200 ${
                    input === topic ? 'bg-green-100 border-green-400 text-green-700' : ''
                  }`}
                  onClick={() => handleChipClick(topic)}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Decorative blobs */}
      <div className="fixed top-20 right-10 w-72 h-72 bg-gradient-to-br from-green-400 to-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse -z-10"></div>
      <div className="fixed bottom-20 left-10 w-72 h-72 bg-gradient-to-br from-green-400 to-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse -z-10"></div>
    </div>
  );
}

Landing.displayName = 'Landing';