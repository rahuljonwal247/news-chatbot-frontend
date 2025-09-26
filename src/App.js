import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import ChatContainer from './components/ChatContainer/ChatContainer';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import ConnectionStatus from './components/ConnectionStatus/ConnectionStatus';
import { useSocket } from './hooks/useSocket';
import { useSession } from './hooks/useSession';
import { useTheme } from './hooks/useTheme';
// import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import './App.scss';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { 
    socket, 
    isConnected, 
    connectionError 
  } = useSocket();
  
  const {
    sessionId,
    messages,
    isLoading,
    createNewSession,
    clearCurrentSession,
    sendMessage
  } = useSession(socket);

  const [sessionStats, setSessionStats] = useState({
    messageCount: 0,
    connectedAt: null
  });

  // Update session stats when session changes
  useEffect(() => {
    if (sessionId && isConnected) {
      socket?.emit('get_session_info');
    }
  }, [sessionId, isConnected, socket]);

  // Listen for session info updates
  useEffect(() => {
    if (!socket) return;

    const handleSessionInfo = (info) => {
      setSessionStats({
        messageCount: info.messageCount || 0,
        connectedAt: info.connectedAt
      });
    };

    socket.on('session_info', handleSessionInfo);

    return () => {
      socket.off('session_info', handleSessionInfo);
    };
  }, [socket]);

  // Handle suggestion clicks
useEffect(() => {
  const handleSuggestion = async (event) => {
    if (event.detail && event.detail.message) {
      // If no session exists, create one first
      if (!sessionId) {
        try {
          await createNewSession();
        } catch (error) {
          console.error('Failed to create new session:', error);
          return;
        }
      }

      handleSendMessage(event.detail.message);
    }
  };

  document.addEventListener('sendSuggestion', handleSuggestion);
  return () => document.removeEventListener('sendSuggestion', handleSuggestion);
}, [sessionId, createNewSession]);


  // const handleNewSession = async () => {
  //   try {
  //     await createNewSession();
  //     setSidebarOpen(false);
  //   } catch (error) {
  //     console.error('Failed to create new session:', error);
  //   }
  // };
const handleNewSession = async () => {
  try {
    await createNewSession();
    setSidebarOpen(false);

    // Dispatch custom event for WelcomeMessage or other listeners
    const event = new CustomEvent('newSessionCreated', {
      detail: { sessionId: sessionId, timestamp: Date.now() }
    });
    document.dispatchEvent(event);

  } catch (error) {
    console.error('Failed to create new session:', error);
  }
};

  const handleClearSession = async () => {
    try {
      await clearCurrentSession();
      setSidebarOpen(false);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  };

const handleSendMessage = async (message) => {
  const trimmed = message?.trim();
  if (!trimmed) {
    console.warn('Cannot send empty message');
    return;
  }
  try {
    await sendMessage(trimmed);
  } catch (error) {
    console.error('Failed to send message:', error);
  }
};


  return (
   
      <div className={`app ${theme}`}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: theme === 'dark' ? '#2d3748' : '#white',
              color: theme === 'dark' ? '#white' : '#2d3748',
            },
          }}
        />
        
        <Header
          sessionId={sessionId}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onToggleTheme={toggleTheme}
          theme={theme}
          isConnected={isConnected}
          messageCount={sessionStats.messageCount}
        />

        <div className="app__body">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            sessionId={sessionId}
            messageCount={sessionStats.messageCount}
            connectedAt={sessionStats.connectedAt}
            onNewSession={handleNewSession}
            onClearSession={handleClearSession}
            theme={theme}
          />

          <main className="app__main">
            <ConnectionStatus
              isConnected={isConnected}
              error={connectionError}
              theme={theme}
            />
            
           <ChatContainer
  messages={messages}
  isLoading={isLoading}
  isConnected={isConnected}
  onSendMessage={handleSendMessage}
  theme={theme}
  sessionId={sessionId}
  createNewSession={createNewSession} // <-- important
/>

          </main>
        </div>
      </div>
    
  );
}

export default App;
