import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

export const useSession = (socket) => {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState(null);

  useEffect(() => {
    if (!socket || !socket.connected) return;

    const savedSessionId = localStorage.getItem('news-chatbot-session');
    const sessionToJoin = savedSessionId || uuidv4();

    socket.emit('join_session', { sessionId: sessionToJoin });
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleSessionJoined = (data) => {
      setSessionId(data.sessionId);
      setMessages(data.history || []);
      localStorage.setItem('news-chatbot-session', data.sessionId);
      console.log('Joined session:', data.sessionId);
    };

    const handleMessageReceived = (message) => {
      if (!message || !message.content) return; // avoid empty messages
      setMessages(prev => [...prev, message]);
      setIsLoading(false);
      setStreamingMessage(null);
    };

    const handleMessageStream = (data) => {
      if (!data || !data.content) return;
      setStreamingMessage(data);
      if (data.isComplete) {
        setMessages(prev => [...prev, data]);
        setStreamingMessage(null);
        setIsLoading(false);
      }
    };

    const handleBotTyping = (data) => {
      setIsLoading(data.isTyping);
      if (!data.isTyping) setStreamingMessage(null);
    };

    const handleSessionCleared = () => {
      setMessages([]);
      toast.success('Session cleared');
    };

    const handleError = (error) => {
      console.error('Session error:', error);
      toast.error(error.message || 'An error occurred');
      setIsLoading(false);
      setStreamingMessage(null);
    };

    socket.on('session_joined', handleSessionJoined);
    socket.on('message_received', handleMessageReceived);
    socket.on('message_stream', handleMessageStream);
    socket.on('bot_typing', handleBotTyping);
    socket.on('session_cleared', handleSessionCleared);
    socket.on('error', handleError);

    return () => {
      socket.off('session_joined', handleSessionJoined);
      socket.off('message_received', handleMessageReceived);
      socket.off('message_stream', handleMessageStream);
      socket.off('bot_typing', handleBotTyping);
      socket.off('session_cleared', handleSessionCleared);
      socket.off('error', handleError);
    };
  }, [socket]);

  const sendMessage = useCallback(async (message) => {
    if (!socket || !sessionId) return;
    const trimmed = message?.trim();
    if (!trimmed) {
      toast.error('Cannot send empty message');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Sending message:', trimmed);
      socket.emit('chat_message', { message: trimmed });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
      setIsLoading(false);
    }
  }, [socket, sessionId]);

  const createNewSession = useCallback(async () => {
    if (!socket) return;
    try {
      const newSessionId = uuidv4();
      socket.emit('join_session', { sessionId: newSessionId });
      toast.success('New session created');
    } catch (error) {
      console.error('Failed to create new session:', error);
      toast.error('Failed to create new session');
    }
  }, [socket]);

  const clearCurrentSession = useCallback(async () => {
    if (!socket || !sessionId) return;
    try {
      socket.emit('clear_session', { sessionId });
    } catch (error) {
      console.error('Failed to clear session:', error);
      toast.error('Failed to clear session');
    }
  }, [socket, sessionId]);

  const displayMessages = streamingMessage ? [...messages, streamingMessage] : messages;

  return {
    sessionId,
    messages: displayMessages,
    isLoading,
    sendMessage,
    createNewSession,
    clearCurrentSession
  };
};
