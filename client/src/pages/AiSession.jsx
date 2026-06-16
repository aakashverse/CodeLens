import { useState, useContext, useEffect } from 'react';
import { RagContext } from '../context/rag.context';
import { useRagSession } from '../hooks/useRagSession';
import GithubConnectForm from '../components/GithubConnectForm';

const AiSession = () => {
  const context = useContext(RagContext);
  const [chatInput, setChatInput] = useState('');

  // Safeguard: If context wrapper is missing, show an explicit error
  if (!context) {
    return (
      <div className="p-6 text-red-400 font-mono text-sm">
        [Error]: RagContext Provider missing. Wrap your routing architecture with RagProvider.
      </div>
    );
  }
  
  // Clean State Extraction from context & hook
  const { repoUrl, sessionState, chatHistory = [], loadingText, resetSession } = context;
  const { handleConnect, handleSendMessage, isAiTyping, error } = useRagSession();

  // // Reset the session state back to 'input' whenever the user enters this view cleanly
  // useEffect(() => {
  //   if (resetSession) {
  //     resetSession();
  //   }
  // }, []);

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      handleSendMessage(chatInput);
      setChatInput('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0A0D14] font-sans">
      {/* Dynamic Header */}
      <header className="h-14 border-b border-gray-800 bg-[#11151D] flex items-center justify-between px-6 shrink-0">
        <h1 className="font-semibold text-gray-200 text-sm">CodeLens AI Session</h1>
        {repoUrl && (
          <div className="text-xs text-gray-500 bg-gray-900 px-3 py-1.5 rounded-full border border-gray-800">
            {repoUrl.split('/').pop().replace('.git', '')}
          </div>
        )}
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Error Notification Alert */}
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 rounded-lg text-xs z-50 font-mono">
            Error: {error}
          </div>
        )}

        {/* View 1: Connect Repo View */}
        {(sessionState === 'input' || sessionState === 'cloning') && (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-[#0A0D14] z-20">
            <GithubConnectForm 
              onSubmit={handleConnect} 
              isLoading={sessionState === 'cloning'} 
              loadingText={loadingText || "Processing repository links..."} 
            />
          </div>
        )}

        {/* View 2: Split Workspace View */}
        {sessionState === 'workspace' && (
          <>
            {/* Left Hand RAG Terminal Chat Workspace */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#0E1117] border-r border-gray-800">
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex gap-4 max-w-3xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${msg.role === 'user' ? 'bg-gradient-to-tr from-purple-500 to-blue-500 text-white' : 'bg-blue-600 text-white'}`}>
                      {msg.role === 'user' ? 'U' : 'AI'}
                    </div>
                    <div className={`px-4 py-2.5 rounded-lg text-sm max-w-[80%] ${msg.role === 'user' ? 'bg-gray-800 border border-gray-700 text-gray-200' : 'font-mono text-gray-300'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isAiTyping && (
                  <div className="max-w-3xl mx-auto text-gray-500 font-mono text-sm animate-pulse flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                    &gt; Compiling repository references...
                  </div>
                )}
              </div>

              {/* Chat Text Bar Form Input Element */}
              <form onSubmit={onFormSubmit} className="p-4 bg-[#0A0D14] border-t border-gray-800 shrink-0">
                <div className="max-w-3xl mx-auto relative flex items-center">
                  <span className="absolute left-4 text-blue-500 font-mono font-bold">&gt;</span>
                  <input 
                    type="text" 
                    value={chatInput} 
                    onChange={(e) => setChatInput(e.target.value)} 
                    disabled={isAiTyping}
                    placeholder="Ask anything about the code..." 
                    className="w-full bg-[#161B22] border border-gray-700 rounded-lg py-3 pl-10 pr-12 text-sm font-mono text-gray-200 focus:outline-none focus:border-blue-500 transition-all disabled:opacity-50"
                  />
                </div>
              </form>
            </main>

            {/* Right Hand Static Directory Tree Area */}
            <aside className="w-72 bg-[#161B22] hidden md:block shrink-0">
              <div className="h-10 border-b border-gray-800 flex items-center px-4 bg-[#11151D]">
                <h2 className="font-semibold text-gray-400 text-[11px] uppercase tracking-wider">Workspace Tree</h2>
              </div>
              <div className="p-4 text-xs text-gray-500 font-mono">
                &gt; Indexing directory mapping...
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  );
};

export default AiSession;