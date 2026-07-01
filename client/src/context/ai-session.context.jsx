import { createContext, useState } from 'react';

export const AiSessionContext = createContext();

export const AiSessionProvider = ({ children }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [sessionState, setSessionState] = useState('input'); 
  const [chatHistory, setChatHistory] = useState([]);
  const [loadingText, setLoadingText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');

  const resetSession = () => {
    setRepoUrl('');
    setSessionState('input');
    setChatHistory([]);
    setLoadingText('');
    setIsLoading(false);
  };

  return (
    <AiSessionContext.Provider value={{
      repoUrl, setRepoUrl,
      sessionState, setSessionState,
      chatHistory, setChatHistory,
      loadingText, setLoadingText,
      isLoading, setIsLoading,
      apiKey, setApiKey,
      selectedModel, setSelectedModel,
      isSaving, setIsSaving,
      resetSession
    }}>
      {children}
    </AiSessionContext.Provider>
  );
};