import { createContext, useState } from 'react';

export const RagContext = createContext(null);

export const RagProvider = ({ children }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [sessionState, setSessionState] = useState('input'); // Default must be 'input'
  const [chatHistory, setChatHistory] = useState([]);
  const [loadingText, setLoadingText] = useState('');

  // The helper function invoked by the useEffect cleanup hook
  const resetSession = () => {
    setRepoUrl('');
    setSessionState('input');
    setChatHistory([]);
    setLoadingText('');
  };

  return (
    <RagContext.Provider value={{
      repoUrl, setRepoUrl,
      sessionState, setSessionState,
      chatHistory, setChatHistory,
      loadingText, setLoadingText,
      resetSession
    }}>
      {children}
    </RagContext.Provider>
  );
};