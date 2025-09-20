import React from 'react';
import { FiMessageCircle, FiZap, FiGlobe } from 'react-icons/fi';
import './WelcomeMessage.scss';

const WelcomeMessage = ({ theme }) => {
  const suggestions = [
    "What are the latest technology news?",
    "Tell me about recent political developments",
    "What's happening in the business world today?",
    "Any updates on climate change news?"
  ];

  const handleSuggestionClick = (suggestion) => {
    const event = new CustomEvent('sendSuggestion', {
      detail: { message: suggestion }
    });
    document.dispatchEvent(event);
  };

  return (
    <div className="welcome-message">
      <div className="welcome-message__header">
        <div className="welcome-message__icon">
          <FiMessageCircle />
        </div>
        <h1>Welcome to News Assistant</h1>
        <p>I'm here to help you stay informed with the latest news. Ask me anything about recent events, and I'll search through trusted news sources to give you accurate, up-to-date information.</p>
      </div>

      <div className="welcome-message__features">
        <div className="welcome-message__feature">
          <FiZap />
          <h3>Real-time Answers</h3>
          <p>Get instant responses based on the latest news articles</p>
        </div>
        <div className="welcome-message__feature">
          <FiGlobe />
          <h3>Trusted Sources</h3>
          <p>Information from reliable news outlets with source attribution</p>
        </div>
        <div className="welcome-message__feature">
          <FiMessageCircle />
          <h3>Natural Conversation</h3>
          <p>Ask follow-up questions and have a natural discussion about news topics</p>
        </div>
      </div>

      <div className="welcome-message__suggestions">
        <h3>Try asking me:</h3>
        <div className="welcome-message__suggestion-list">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="welcome-message__suggestion"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              "{suggestion}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;