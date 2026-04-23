import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const API_BASE = 'http://localhost:5000';

const STEPS = [
  'Analyzing your topic...',
  'Fetching knowledge sources...',
  'Processing and chunking content...',
  'Initializing your assistant...',
];

export default function Loading({ topic, sessionId, onReady, onError }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const hasInitialized = useRef(false);

  const initializeTopic = useCallback(async () => {
    try {
      // Step 1
      setCurrentStep(0);
      setStatusMessage('Analyzing your topic...');

      const response = await fetch(`${API_BASE}/api/topic/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, sessionId })
      });

      // Step 2
      setCurrentStep(1);
      setStatusMessage('Fetching knowledge sources...');

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to initialize topic: ${response.status}`);
      }

      const data = await response.json();

      // Step 3
      setCurrentStep(2);
      setStatusMessage('Processing and chunking content...');

      await new Promise(r => setTimeout(r, 800));

      // Step 4
      setCurrentStep(3);
      setStatusMessage('Initializing your assistant...');

      await new Promise(r => setTimeout(r, 800));

      onReady(data.domain);

    } catch (err) {
      console.error('Initialization error:', err.message);
      let userMessage = err.message || 'Failed to build your assistant. Please try again.';

      if (err instanceof TypeError) {
        userMessage = 'Cannot reach backend. Make sure it\'s running on localhost:5000';
      }

      onError(userMessage);
    }
  }, [topic, sessionId, onReady, onError]);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    initializeTopic();
  }, [initializeTopic]);

  return (
    <div className="fade-in w-full h-full flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">

        {/* Lottie Animation */}
        <div className="mb-6 flex justify-center">
          <DotLottieReact
            src="/Live chatbot.lottie"
            loop
            autoplay
            style={{ width: 180, height: 180 }}
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
          Building your AI for
        </h2>
        <p className="text-xl font-bold gradient-text mb-8">
          "{topic}"
        </p>

        {/* Step Progress */}
        <div className="text-left mb-8 space-y-3">
          {STEPS.map((step, index) => (
            <div
              key={step}
              className={`flex items-center gap-3 transition-all duration-500 ${
                index <= currentStep ? 'opacity-100' : 'opacity-25'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300 ${
                  index < currentStep
                    ? 'bg-green-500 text-white'
                    : index === currentStep
                    ? 'bg-green-100 text-green-600 border border-green-400'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>

              <span
                className={`text-sm font-medium ${
                  index < currentStep
                    ? 'text-green-600 line-through'
                    : index === currentStep
                    ? 'text-gray-800'
                    : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>

        {/* Status message */}
        {statusMessage && (
          <p className="text-xs text-gray-400 mb-4 italic">
            {statusMessage}
          </p>
        )}

        {/* Bouncing dots */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-green-500 animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>

      </div>

      {/* Background blob */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400 to-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>
    </div>
  );
}
