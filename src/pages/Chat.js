import React, { useState, useRef, useEffect } from 'react';

const API_BASE = 'http://localhost:5000';

export default function Chat({ topic, domain, sessionId, onReset, onError }) {
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      text: `Hello! I'm your AI assistant specialized in "${topic}". I'll only answer questions related to this topic. Go ahead and ask me anything!`,
      isOutOfScope: false
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const callBackend = async (userMessage) => {
    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage,
          sessionId
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Backend error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new Error('Failed to connect to backend. Make sure it\'s running on localhost:5000');
      }
      throw err;
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setIsLoading(true);

    let retryCount = 0;
    const maxRetries = 3;

    const attemptSend = async () => {
      try {
        const data = await callBackend(userMessage);

        setMessages(prev => [...prev, {
          type: 'ai',
          text: data.reply,
          isOutOfScope: data.isOutOfScope
        }]);
      } catch (err) {
        const errorMsg = err.message.toLowerCase();
        const isRateLimit = errorMsg.includes('429') || errorMsg.includes('rate limit') || errorMsg.includes('quota');

        if (isRateLimit && retryCount < maxRetries) {
          retryCount++;
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              type: 'ai',
              text: `⏳ Too many requests — retrying in 30 seconds... (attempt ${retryCount}/${maxRetries})`,
              isRateLimit: true
            };
            return updated;
          });

          await new Promise(resolve => setTimeout(resolve, 30000));
          await attemptSend();
        } else {
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              type: 'ai',
              text: isRateLimit && retryCount >= maxRetries 
                ? '❌ Rate limit exceeded after retries. Please try again in a few minutes.'
                : err.message,
              isError: true
            };
            return updated;
          });
        }
      }
    };

    try {
      await attemptSend();
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      if (!response.ok) {
        console.warn(`Reset warning: ${response.status}`);
      }
    } catch (err) {
      console.error('Reset error:', err.message);
    } finally {
      onReset();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
      handleSendMessage();
    }
  };

  return (
    <div className="fade-in w-full h-full flex flex-col bg-white">

      {/* Header */}
      <div className="border-b border-gray-200 px-4 md:px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            AI for: <span className="gradient-text">{topic}</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <p className="text-xs text-gray-400 font-light">
              Domain locked · Answers only within this topic
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="glass-btn text-sm hover:bg-red-50"
          title="Create a new AI"
        >
          ↻ New
        </button>
      </div>

      {/* Domain Lock Badge */}
      <div className="bg-green-50 border-b border-green-100 px-4 md:px-8 py-2 flex items-center gap-2">
        <span className="text-xs font-medium tracking-widest text-green-600">
          ✦ FOCUSED ON:
        </span>
        <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
          {topic}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'user' ? (
              <div className="user-message shadow-md max-w-xs md:max-w-md">
                {message.text}
              </div>
            ) : (
              <div className={`shadow-md max-w-xs md:max-w-md rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                message.isOutOfScope
                  ? 'bg-red-50 border border-red-200 text-red-700'
                  : 'ai-message'
              }`}>
                {message.isOutOfScope && (
                  <p className="text-xs font-bold text-red-400 mb-1 tracking-wide">
                    OUT OF SCOPE
                  </p>
                )}
                {message.text}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="ai-message shadow-md flex gap-2 items-center px-4 py-3">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-green-500 animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="border-t border-gray-200 p-4 md:p-6">
        <div className="flex gap-3 items-end">
          <input
            type="text"
            className="glass-input flex-1"
            placeholder={`Ask anything about ${topic}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button
            className="glass-btn px-4 md:px-6 py-3 hover:scale-105 transition-transform disabled:opacity-40"
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
          >
            <span className="text-lg">→</span>
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>

      <div className="fixed top-32 right-20 w-64 h-64 bg-gradient-to-br from-green-400 to-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>
    </div>
  );
}