
import React, { useState, useRef, useEffect } from 'react';
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
  sessionId,
  createNewSession, // pass this from App.js
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Typing indicator timeout
  useEffect(() => {
    const timer = setTimeout(() => setIsTyping(false), 3000);
    return () => clearTimeout(timer);
  }, [isTyping]);

  // Auto-create session & send message
  // const handleSendMessage = async (message) => {
  //   if (!isConnected || !message?.trim()) return;

  //   setIsTyping(true);

  //   try {
  //     // 1️⃣ Create new session if it doesn't exist
  //     if (!sessionId) {
  //       await createNewSession();
  //       // Wait a short moment to ensure sessionId is set
  //       await new Promise((resolve) => setTimeout(resolve, 200));
  //     }

  //     // 2️⃣ Send the message
  //     await onSendMessage(message);
  //   } catch (error) {
  //     console.error('Error sending message:', error);
  //     setIsTyping(false);
  //   }
  // };

  const handleSendMessage = async (message) => {
  if (!isConnected || !message?.trim()) return;

  setIsTyping(true);

  try {
    // 1️⃣ Create new session if it doesn't exist
    if (!sessionId) {
      await createNewSession();

      // 2️⃣ Wait until sessionId is set (polling)
      let retries = 0;
      while (!sessionId && retries < 20) { // wait up to 2 seconds
        await new Promise((resolve) => setTimeout(resolve, 100));
        retries++;
      }

      if (!sessionId) {
        console.error('Session was not created in time.');
        setIsTyping(false);
        return;
      }
    }

    // 3️⃣ Send the message now that session exists
    await onSendMessage(message);

  } catch (error) {
    console.error('Error sending message:', error);
    setIsTyping(false);
  }
};


  const showWelcome = messages.length === 0 && !isLoading;

  return (
    <div className="chat-container">
      <div className="chat-container__content">
        {showWelcome ? (
          <WelcomeMessage theme={theme} />
        ) : (
          <>
            <MessageList messages={messages} theme={theme} isLoading={isLoading} />
            {isTyping && <TypingIndicator theme={theme} />}
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
              : !sessionId
                ? "Creating session..."
                : "Ask me about recent news..."
          }
        />
      </div>
    </div>
  );
};

export default ChatContainer;
