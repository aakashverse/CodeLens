import { createContext, useState } from 'react';

export const WorkspaceContext = createContext(null);

export const WorkspaceProvider = ({ children }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [sessionState, setSessionState] = useState('input'); 
  const [chatHistory, setChatHistory] = useState([]);
  const [loadingText, setLoadingText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // The helper function invoked by the useEffect cleanup hook
  const resetSession = () => {
    setRepoUrl('');
    setSessionState('input');
    setChatHistory([]);
    setLoadingText('');
    setIsLoading(false);
  };

  return (
    <WorkspaceContext.Provider value={{
      repoUrl, setRepoUrl,
      sessionState, setSessionState,
      chatHistory, setChatHistory,
      loadingText, setLoadingText,
      isLoading, setIsLoading,
      resetSession
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};