import { useContext, useState } from 'react';
import { AiSessionContext } from '../context/ai-session.context.jsx';
import { connectRepo, sendChatMessage} from '../api/ai-session.api.js';
import { SendApiKey } from "../api/settings.api.js";
import { useAuth } from './useAuth.js';
import useToast from './useToast.js';

export const useAiSession = () => {
  const {user} = useAuth();
    const context = useContext(AiSessionContext);
    const {
        repoUrl, setRepoUrl,
        setSessionState,
        setChatHistory,
        loadingText, setLoadingText,
        isLoading, setIsLoading,
        setApiKey,
        setIsSaving

    } = context;

  const [isAiTyping, setIsAiTyping] = useState(false);
  const [error, setError] = useState(null);
  const {showError} = useToast();

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
          content: `Repository successfully indexed` 
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
    
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsAiTyping(true);
  
    try {
      const data = await sendChatMessage(userMessage, repoUrl);
      setChatHistory(prev => [...prev, { role: 'ai', content: data.answer }]);

    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'ai', content: `Error encountered: ${err.message}` }]);
      showError("Please check your API KEY Validity");
    } finally {
      setIsAiTyping(false);
    }
  };

  // api handdlerr
  const handleApiKey = async(apiKey, selectedModel, onClose) => {
    setIsSaving(true);
    
    try {
      const data = await SendApiKey(apiKey, selectedModel);
      user.aiModel = selectedModel;
      console.log('handleApiKey success: ', data);
      
      // close modal
      if(onClose) {
        setTimeout(() => onClose(), 500);
      }
      
      return data;
    } catch(err) {
      console.error('handleApiKey error: ', err);
      throw err; 
    } finally {
      setApiKey(''); // clear 
      setIsSaving(false);
    }
  };

  return {
    handleConnect,
    handleSendMessage,
    handleApiKey,
    isLoading,
    setIsLoading,
    loadingText,
    isAiTyping,
    error
  };
}