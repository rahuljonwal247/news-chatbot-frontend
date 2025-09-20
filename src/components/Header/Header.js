import React from 'react';
import { FiMenu, FiSun, FiMoon, FiWifi, FiWifiOff, FiMessageSquare } from 'react-icons/fi';
import './Header.scss';

const Header = ({
  sessionId,
  onToggleSidebar,
  onToggleTheme,
  theme,
  isConnected,
  messageCount
}) => {
  return (
    <header className="header">
      <div className="header__left">
        <button
          className="header__menu-btn"
          onClick={onToggleSidebar}
          title="Toggle menu"
        >
          <FiMenu />
        </button>
        
        <div className="header__title">
          <h1>News Assistant</h1>
          <span className="header__subtitle">
            AI-powered news chatbot
          </span>
        </div>
      </div>

      <div className="header__center">
        {sessionId && (
          <div className="header__session-info">
            <FiMessageSquare />
            <span>{messageCount || 0} messages</span>
          </div>
        )}
      </div>

      <div className="header__right">
        <div className="header__connection-status">
          {isConnected ? (
            <div className="header__status header__status--connected">
              <FiWifi />
              <span>Connected</span>
            </div>
          ) : (
            <div className="header__status header__status--disconnected">
              <FiWifiOff />
              <span>Disconnected</span>
            </div>
          )}
        </div>

        <button
          className="header__theme-btn"
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>
      </div>
    </header>
  );
};

export default Header;