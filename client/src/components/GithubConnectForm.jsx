import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useWorkspace } from '../hooks/useWorkspace';

const GithubConnectForm = () => {
  const {isLoading, handleConnect, loadingText} = useWorkspace();
  const [url, setUrl] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    console.log("before submit: ", isLoading);
    e.preventDefault();
    
    if(url.trim()) {
      await handleConnect(url);
      navigate('/ai-session');
    }
  };

  console.log("after submit: ", isLoading);

  return (
    
    <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center p-6 font-sans">
      
      <div className="w-full max-w-xl bg-[#11151D] border border-gray-800/60 rounded-2xl shadow-2xl overflow-hidden relative">
       
        <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 w-full"></div>
        
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gray-900 rounded-xl border border-gray-800 shadow-inner">
              <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Connect Workspace</h2>
              <p className="text-sm text-gray-500">Paste a public GitHub URL to begin analysis.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
              </div>
              <input 
                type="url" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                placeholder="https://github.com/username/repo" 
                className="w-full bg-[#0A0D14] border border-gray-700 rounded-xl py-3.5 pl-12 pr-4 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading || !url}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing...
                </>
              ) : (
                'Connect & Analyze'
              )}
            </button>
          </form>

          {isLoading && (
            <div className="mt-6 bg-[#0A0D14] border border-gray-800 rounded-lg p-4 font-mono text-xs text-gray-400 h-24 overflow-hidden flex flex-col justify-end">
              <p className="text-blue-400 mb-1">$ codelens fetch {url.split('/').slice(-2).join('/') || 'repo'}</p>
              <p className="animate-pulse text-gray-300">{loadingText}</p>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default GithubConnectForm;