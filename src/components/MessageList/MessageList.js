import React from 'react';
import Message from '../Message/Message';
import LoadingMessage from '../LoadingMessage/LoadingMessage';
import './MessageList.scss';

const MessageList = ({ messages, theme, isLoading }) => {
  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <Message
          key={message.id || index}
          message={message}
          theme={theme}
          isLatest={index === messages.length - 1}
        />
      ))}
      
      {isLoading && <LoadingMessage theme={theme} />}
    </div>
  );
};

export default MessageList;