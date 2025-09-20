import React, { useState, useEffect, useRef } from 'react';
import MessageList from '../MessageList/MessageList';
import MessageInput from '../MessageInput/MessageInput';
import TypingIndicator from '../TypingIndicator/TypingIndicator';
import WelcomeMessage from '../WelcomeMessage/WelcomeMessage';
import './ChatContainer.scss';

const ChatContainer = ({
  messages,
  isLoading,
  isConnected,
  onSendMessage,
  theme,
  sessionId
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle typing indicator
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    });
  };

  const handleSendMessage = async (message) => {
    if (!isConnected) {
      return;
    }

    setIsTyping(true);
    try {
      await onSendMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    }
  };

  const showWelcome = messages.length === 0 && !isLoading;

  return (
    <div className="chat-container" ref={containerRef}>
      <div className="chat-container__content">
        {showWelcome ? (
          <WelcomeMessage theme={theme} />
        ) : (
          <>
            <MessageList 
              messages={messages}
              theme={theme}
              isLoading={isLoading}
            />
            
            {isTyping && (
              <TypingIndicator theme={theme} />
            )}
          </>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-container__input">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={!isConnected || isLoading}
          isLoading={isLoading}
          theme={theme}
          placeholder={
            !isConnected 
              ? "Connecting..." 
              : isLoading 
                ? "Processing..." 
                : "Ask me about recent news..."
          }
        />
      </div>
    </div>
  );
};

export default ChatContainer;