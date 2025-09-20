import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiMic, FiMicOff } from 'react-icons/fi';
import './MessageInput.scss';

const MessageInput = ({
  onSendMessage,
  disabled,
  isLoading,
  theme,
  placeholder = "Type your message..."
}) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Speech recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(prev => prev + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || disabled) {
      return;
    }

    const messageToSend = message.trim();
    setMessage('');
    
    try {
      await onSendMessage(messageToSend);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Restore message on error
      setMessage(messageToSend);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const canSend = message.trim().length > 0 && !disabled;
  const showSpeechButton = !!recognitionRef.current;

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <div className="message-input__wrapper">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="message-input__field"
          rows="1"
          maxLength={1000}
        />
        
        <div className="message-input__actions">
          {showSpeechButton && (
            <button
              type="button"
              className={`message-input__action message-input__action--speech ${isListening ? 'active' : ''}`}
              onClick={toggleSpeechRecognition}
              disabled={disabled}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <FiMicOff /> : <FiMic />}
            </button>
          )}
          
          <button
            type="submit"
            className="message-input__action message-input__action--send"
            disabled={!canSend}
            title="Send message"
          >
            <FiSend />
          </button>
        </div>
      </div>
      
      {message.length > 900 && (
        <div className="message-input__counter">
          {message.length}/1000
        </div>
      )}
    </form>
  );
};

export default MessageInput;