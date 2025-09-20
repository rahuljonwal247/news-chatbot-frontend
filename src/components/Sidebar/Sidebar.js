import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  FiX, 
  FiPlus, 
  FiTrash2, 
  FiMessageCircle, 
  FiClock,
  FiInfo,
  FiGithub,
  FiExternalLink
} from 'react-icons/fi';
import './Sidebar.scss';

const Sidebar = ({
  isOpen,
  onClose,
  sessionId,
  messageCount,
  connectedAt,
  onNewSession,
  onClearSession,
  theme
}) => {
  const formatConnectionTime = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      <div className="sidebar__overlay" onClick={onClose} />
      
      <div className="sidebar__content">
        <div className="sidebar__header">
          <h2>Menu</h2>
          <button className="sidebar__close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="sidebar__section">
          <h3>Session</h3>
          
          <div className="sidebar__session-info">
            {sessionId ? (
              <>
                <div className="sidebar__info-item">
                  <FiMessageCircle />
                  <div>
                    <span className="label">Messages</span>
                    <span className="value">{messageCount || 0}</span>
                  </div>
                </div>
                
                <div className="sidebar__info-item">
                  <FiClock />
                  <div>
                    <span className="label">Connected</span>
                    <span className="value">{formatConnectionTime(connectedAt)}</span>
                  </div>
                </div>
                
                <div className="sidebar__info-item">
                  <FiInfo />
                  <div>
                    <span className="label">Session ID</span>
                    <span className="value session-id">
                      {sessionId.substring(0, 8)}...
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className="sidebar__no-session">No active session</p>
            )}
          </div>

          <div className="sidebar__actions">
            <button
              className="sidebar__action sidebar__action--primary"
              onClick={onNewSession}
            >
              <FiPlus />
              New Session
            </button>
            
            {sessionId && messageCount > 0 && (
              <button
                className="sidebar__action sidebar__action--danger"
                onClick={onClearSession}
              >
                <FiTrash2 />
                Clear Messages
              </button>
            )}
          </div>
        </div>

        <div className="sidebar__section">
          <h3>Features</h3>
          <ul className="sidebar__feature-list">
            <li>🔍 Real-time news search</li>
            <li>📰 Multiple trusted sources</li>
            <li>🤖 AI-powered responses</li>
            <li>💬 Natural conversations</li>
            <li>📱 Mobile-friendly design</li>
            <li>🌓 Dark/Light themes</li>
          </ul>
        </div>

        <div className="sidebar__footer">
          <div className="sidebar__links">
            <a
              href="https://github.com/yourusername/news-chatbot"
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar__link"
            >
              <FiGithub />
              GitHub
              <FiExternalLink />
            </a>
          </div>
          
          <p className="sidebar__version">
            Version 1.0.0
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;