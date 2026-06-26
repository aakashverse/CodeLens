import { useState, useContext } from 'react';
import { WorkspaceContext } from '../context/workspace.context';
import { useWorkspace } from '../hooks/useWorkspace';
import GithubConnectForm from '../components/GithubConnectForm';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AiSession = () => {
  const context = useContext(WorkspaceContext);  
  const { repoUrl, sessionState, chatHistory = [], loadingText } = context;
  const { handleConnect, handleSendMessage, isAiTyping, error } = useWorkspace();
  
  const [chatInput, setChatInput] = useState('');
  
  if (!context) {
    return (
      <div className="p-6 text-red-400 font-mono text-sm">
        [Error]: workspace Provider missing. Wrap your routing architecture with workspace.
      </div>
    );
  }

  const onFormSubmit = (e) => {
    e.preventDefault();
    if(chatInput.trim()) {
      handleSendMessage(chatInput);
      setChatInput('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0A0D14] font-sans">
      
      <header className="h-14 border-b border-gray-800 bg-[#11151D] flex items-center justify-between px-6 shrink-0">
        <h1 className="font-semibold text-gray-200 text-sm">CodeLens AI</h1>
        {repoUrl && (
          <div className="text-xs text-gray-500 bg-gray-900 px-3 py-1.5 rounded-full border border-gray-800">
            {repoUrl.split('/').pop().replace('.git', '')}
          </div>
        )}
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 rounded-lg text-xs z-50 font-mono">
            Error: {error}
          </div>
        )}

        {((sessionState === 'input' && !repoUrl) || sessionState === 'cloning') && (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-[#0A0D14] z-20">
            <GithubConnectForm 
              onSubmit={handleConnect} 
              isLoading={sessionState === 'cloning'} 
              loadingText={loadingText || "Processing repository links..."} 
            />
          </div>
        )}

        {(sessionState === 'workspace' || repoUrl) && (
          <>
            
            <main className="flex-1 flex flex-col min-w-0 bg-[#0E1117] border-r border-gray-800">
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex gap-4 max-w-4xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-1 ${msg.role === 'user' ? 'bg-gradient-to-tr from-purple-500 to-blue-500 text-white' : 'bg-blue-600 text-white'}`}>
                      {msg.role === 'user' ? 'U' : 'AI'}
                    </div>
                    
                    <div className={`px-5 py-4 rounded-xl text-sm max-w-[85%] ${msg.role === 'user' ? 'bg-gray-800 border border-gray-700 text-gray-200 rounded-tr-sm' : 'text-gray-300 w-full'}`}>
                      
                      {msg.role === 'user' ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            // Style paragraphs
                            p: ({node, ...props}) => <p className="mb-4 leading-relaxed last:mb-0" {...props} />,
                            // Style headers
                            h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mb-4 mt-6" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-xl font-bold text-white mb-3 mt-5" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-lg font-bold text-white mb-3 mt-4" {...props} />,
                            // Style lists
                            ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                            li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                            // Style bold text
                            strong: ({node, ...props}) => <strong className="font-semibold text-blue-400" {...props} />,
                            // Style code blocks and inline code
                            code({node, inline, className, children, ...props}) {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline && match ? (
                                <div className="rounded-lg overflow-hidden my-4 border border-gray-800 shadow-lg">
                                  <div className="flex items-center px-4 py-1.5 bg-gray-900 border-b border-gray-800 text-xs text-gray-500 font-mono">
                                    {match[1]}
                                  </div>
                                  <SyntaxHighlighter
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                    customStyle={{ margin: 0, background: '#0d1117', padding: '1rem', fontSize: '0.85rem' }}
                                    {...props}
                                  >
                                    {String(children).replace(/\n$/, '')}
                                  </SyntaxHighlighter>
                                </div>
                              ) : (
                                <code className="bg-gray-800 border border-gray-700 text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                                  {children}
                                </code>
                              )
                            }
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      )}

                    </div>
                  </div>
                ))}

                
                {isAiTyping && (
                  <div className="flex gap-4 max-w-4xl mx-auto">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-1 bg-blue-600 text-white">AI</div>
                    <div className="px-5 py-4 text-gray-500 font-mono text-sm animate-pulse flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                      &gt; Compiling repository references...
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={onFormSubmit} className="p-4 bg-[#0A0D14] border-t border-gray-800 shrink-0">
                <div className="max-w-4xl mx-auto relative flex items-center">
                  <span className="absolute left-4 text-blue-500 font-mono font-bold">&gt;</span>
                  <input 
                    type="text" 
                    value={chatInput} 
                    onChange={(e) => setChatInput(e.target.value)} 
                    disabled={isAiTyping}
                    placeholder="Ask anything about the code..." 
                    className="w-full bg-[#161B22] border border-gray-700 rounded-lg py-3.5 pl-10 pr-12 text-sm text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50 shadow-inner"
                  />
                  <button 
                    type="submit"
                    disabled={isAiTyping || !chatInput.trim()}
                    className="absolute right-2 p-1.5 rounded-md bg-blue-600/20 text-blue-500 hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-blue-600/20 disabled:hover:text-blue-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </div>
              </form>
            </main>

            <aside className="w-72 bg-[#161B22] hidden md:flex flex-col shrink-0 border-l border-gray-800">
              <div className="h-14 border-b border-gray-800 flex items-center px-4 bg-[#11151D] shrink-0">
                <h2 className="font-semibold text-gray-400 text-[11px] uppercase tracking-wider">Workspace Tree</h2>
              </div>
              <div className="p-4 text-xs text-gray-500 font-mono flex-1 overflow-y-auto">
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