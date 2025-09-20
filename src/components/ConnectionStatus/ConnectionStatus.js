import React from 'react';
import { FiAlertCircle, FiWifiOff, FiRefreshCw } from 'react-icons/fi';
import './ConnectionStatus.scss';

const ConnectionStatus = ({ isConnected, error, theme }) => {
  if (isConnected && !error) {
    return null;
  }

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="connection-status connection-status--error">
      <div className="connection-status__content">
        <div className="connection-status__icon">
          {error ? <FiAlertCircle /> : <FiWifiOff />}
        </div>
        
        <div className="connection-status__text">
          <h3>Connection Issue</h3>
          <p>
            {error 
              ? `Connection error: ${error}`
              : 'Lost connection to server. Please check your internet connection.'
            }
          </p>
        </div>
        
        <button
          className="connection-status__retry"
          onClick={handleRetry}
        >
          <FiRefreshCw />
          Retry
        </button>
      </div>
    </div>
  );
};

export default ConnectionStatus;