import React from 'react';
import { FaRobot } from "react-icons/fa";
import './LoadingMessage.scss';

const LoadingMessage = ({ theme }) => {
  return (
    <div className="loading-message">
      <div className="loading-message__avatar">
        <FaRobot />
      </div>
      <div className="loading-message__content">
        <div className="loading-message__skeleton">
          <div className="loading-message__line loading-message__line--short"></div>
          <div className="loading-message__line loading-message__line--medium"></div>
          <div className="loading-message__line loading-message__line--long"></div>
        </div>
        <span className="loading-message__text">Searching news articles...</span>
      </div>
    </div>
  );
};

export default LoadingMessage;