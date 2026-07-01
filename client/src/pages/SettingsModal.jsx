import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth'; 
import useToast from '../hooks/useToast'; 
import { useAiSession } from '../hooks/useAi-session';
import { AiSessionContext } from '../context/ai-session.context';
import { GetUserSettings } from '../api/settings.api'; 

const SettingsModal = ({ isOpen, onClose }) => {
  const { user, refreshUser } = useAuth(); 
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  
  const {apiKey, setApiKey, selectedModel, setSelectedModel } = useContext(AiSessionContext); ;
  
  const { handleApiKey, isSaving } = useAiSession();

  const [isLoading, setIsLoading] = useState(true);
  const [hasExistingKey, setHasExistingKey] = useState(false);
  const [isEditingKey, setIsEditingKey] = useState(false);

  useEffect(() => {
    const checkExistingSettings = async () => {
      if (!isOpen) return;
      setIsLoading(true);
      
      try {
        const data = await GetUserSettings();

        if(data.hasApiKey) {
          setHasExistingKey(true);
          setIsEditingKey(false); 
        } else {
          setHasExistingKey(false);
          setIsEditingKey(true); 
        }
        
        if(data.aiModel) {
          setSelectedModel(data.aiModel);
        }
      } catch(error) {
        console.error("Failed to fetch settings status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSettings();
  }, [isOpen, setSelectedModel]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();

    if (isEditingKey && !apiKey.trim()) {
      showError("Please provide an API key, or click Cancel.");
      return;
    }

    try {
       await handleApiKey(apiKey, selectedModel, onClose);
       await refreshUser();
       showSuccess("AI Preferences saved securely.");
       navigate("/dashboard");
    } catch(error) {
      console.error("Failed to save settings:", error);
      showError("Failed to update preferences.");
    } finally {
      setApiKey(''); // Always clear on close
    }
  };

  const handleCancelEdit = () => {
    setIsEditingKey(false);
    setApiKey('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-[#0E1117] border border-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all">
        <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            AI Preferences
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
             <svg className="animate-spin h-6 w-6 text-blue-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
             </svg>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center justify-between">
                <span>
                  Gemini API Key
                  {hasExistingKey && !isEditingKey && <span className="ml-2 text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">Configured</span>}
                </span>
                
                {hasExistingKey && (
                  <button 
                    type="button" 
                    onClick={isEditingKey ? handleCancelEdit : () => setIsEditingKey(true)}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {isEditingKey ? 'Cancel' : 'Edit Key'}
                  </button>
                )}
              </label>
              
              <p className="text-xs text-gray-500 mb-2">
                {isEditingKey 
                  ? "Keys are encrypted via AES-256 before being stored in our database." 
                  : "Your API key is securely encrypted and hidden."}
              </p>
              
              <input
                type="password"
                value={!isEditingKey ? "••••••••••••••••••••••••••••" : apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={!isEditingKey}
                placeholder="Enter your new API Key..."
                className={`w-full text-sm rounded-lg block p-2.5 outline-none transition-all ${
                  !isEditingKey 
                  ? 'bg-gray-900/50 border border-gray-800 text-gray-500 cursor-not-allowed select-none' 
                  : 'bg-[#111827] border border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-600'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Generative Model</label>
              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-[#111827] border border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none appearance-none cursor-pointer transition-colors"
                >
                  <option value="gemini-2.5-flash">gemini-2.5-flash (Recommended)</option>
                  <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                  <option value="gemini-2.0-flash">gemini-2.0-flash (Preview)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-800/80 mt-6">
              <button 
                type="submit" 
                disabled={isSaving || (isEditingKey && !apiKey.trim())}
                className="w-full mt-4 flex justify-center items-center bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                {isSaving ? (
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : 'Save'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SettingsModal;