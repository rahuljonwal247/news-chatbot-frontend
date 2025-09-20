import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiUser, FiCopy, FiCheck, FiExternalLink } from 'react-icons/fi';
import './Message.scss';
import { FaRobot } from "react-icons/fa";
const Message = ({ message, theme, isLatest }) => {
  const [copied, setCopied] = useState(false);
  const [showSources, setShowSources] = useState(false);

  const isBot = message.type === 'bot';
  const isError = message.isError;

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'just now';
    }
  };

  return (
    <div className={`message ${isBot ? 'message--bot' : 'message--user'} ${isError ? 'message--error' : ''}`}>
      <div className="message__avatar">
        {isBot ? <FaRobot /> : <FiUser />}
      </div>
      
      <div className="message__content">
        <div className="message__header">
          <span className="message__sender">
            {isBot ? 'News Assistant' : 'You'}
          </span>
          <span className="message__timestamp">
            {formatTimestamp(message.timestamp)}
          </span>
          <button
            className="message__copy"
            onClick={handleCopyMessage}
            title="Copy message"
          >
            {copied ? <FiCheck /> : <FiCopy />}
          </button>
        </div>
        
        <div className="message__body">
          {isBot ? (
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={theme === 'dark' ? tomorrow : prism}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            <p>{message.content}</p>
          )}
        </div>

        {/* Sources section for bot messages */}
        {isBot && message.sources && message.sources.length > 0 && (
          <div className="message__sources">
            <button
              className="message__sources-toggle"
              onClick={() => setShowSources(!showSources)}
            >
              {showSources ? 'Hide' : 'Show'} Sources ({message.sources.length})
            </button>
            
            {showSources && (
              <div className="message__sources-list">
                {message.sources.map((source, index) => (
                  <div key={index} className="message__source">
                    <div className="message__source-header">
                      <h4>{source.title}</h4>
                      <span className="message__source-meta">
                        {source.source} • {formatTimestamp(source.publishedAt)}
                      </span>
                    </div>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="message__source-link"
                    >
                      Read full article <FiExternalLink />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Metadata for bot messages */}
        {isBot && message.retrievedDocs && (
          <div className="message__metadata">
            <span>Retrieved {message.retrievedDocs} relevant documents</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;