import React from 'react';
import { FaRobot } from "react-icons/fa";
import './TypingIndicator.scss';

const TypingIndicator = ({ theme }) => {
  return (
    <div className="typing-indicator">
      <div className="typing-indicator__avatar">
        <FaRobot />
      </div>
      <div className="typing-indicator__content">
        <div className="typing-indicator__dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span className="typing-indicator__text">Assistant is thinking...</span>
      </div>
    </div>
  );
};

export default TypingIndicator;