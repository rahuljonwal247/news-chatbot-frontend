import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
    
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      setConnectionError(null);
      reconnectAttempts.current = 0;
      
      if (reconnectAttempts.current > 0) {
        toast.success('Reconnected to server');
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
      setIsConnected(false);
      
      if (reason !== 'io client disconnect') {
        toast.error('Connection lost. Attempting to reconnect...');
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnectionError(error.message);
      reconnectAttempts.current++;
      
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        toast.error('Failed to connect to server. Please refresh the page.');
      }
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Reconnection attempt ${attemptNumber}`);
      toast.loading(`Reconnecting... (${attemptNumber}/${maxReconnectAttempts})`);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('Failed to reconnect after maximum attempts');
      toast.error('Unable to reconnect. Please refresh the page.');
    });

    // Error handling
    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      toast.error(error.message || 'An error occurred');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return {
    socket,
    isConnected,
    connectionError
  };
};