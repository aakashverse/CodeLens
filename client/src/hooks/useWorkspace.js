import { useContext, useState } from 'react';
import { WorkspaceContext } from '../context/workspace.context.jsx';
import { connectRepo, sendChatMessage} from '../services/workspace.api';

export const useWorkspace = () => {
    const context = useContext(WorkspaceContext);
    const {
        repoUrl,
        setRepoUrl,
        setSessionState,
        setChatHistory,
        setLoadingText,
        isLoading,
        loadingText,
        setIsLoading,
    } = context;

  const [isAiTyping, setIsAiTyping] = useState(false);
  const [error, setError] = useState(null);

  // Connection Handler
  const handleConnect = async (url) => {
    setError(null);
    setIsLoading(true);
    setRepoUrl(url);
    setSessionState('cloning');
    setLoadingText("Cloning and parsing repository. Building structural context map...");

    try {
      const data = await connectRepo(url);
      
      setChatHistory([
        { 
          role: 'ai', 
          content: `Repository successfully indexed! Analyzed. Ask away about the codebase components.` 
        }
      ]);
      setSessionState('workspace');
    } catch (err) {
      setError(err.message);
      setSessionState('input');
    } finally{
      setIsLoading(false);
    }
  };

  // Message Sender Handler
  const handleSendMessage = async (question) => {
    if (!question.trim() || isAiTyping) return;

    setError(null);
    const userMessage = question.trim();
    
    // Optimistic UI updates
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsAiTyping(true);
  
    try {
      const data = await sendChatMessage(userMessage, repoUrl);
      setChatHistory(prev => [...prev, { role: 'ai', content: data.answer }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'ai', content: `Error encountered: ${err.message}` }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  return {
    handleConnect,
    handleSendMessage,
    isLoading,
    setIsLoading,
    loadingText,
    isAiTyping,
    error
  };
};