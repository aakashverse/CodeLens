import { useState, useContext } from 'react';
import { useReadme } from '../hooks/useReadme';
import useToast from '../hooks/useToast';

// Markdown Imports
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ReadmeContext } from '../context/readme.context';
import { AiSessionContext } from '../context/ai-session.context';

const AutoReadme = () => {
  const {showSuccess} = useToast();

  const context = useContext(ReadmeContext);
  const {isGenerating, generatedMarkdown, logs} = context;
  const { repoUrl } = useContext(AiSessionContext);
  const {handleGenerate} = useReadme();
  
  const [viewMode, setViewMode] = useState('preview'); 

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMarkdown);
    showSuccess('copied to clipboard!');
  };


  return (
    <div className="flex flex-col h-screen bg-[#0A0D14] font-sans">
      
      <header className="h-14 border-b border-gray-800 bg-[#11151D] flex items-center justify-between px-6 shrink-0">
        <h1 className="font-semibold text-gray-200 text-sm flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Auto-README Generator
        </h1>
        
        <div className="flex items-center gap-4">
          <div className="text-xs text-gray-400 bg-gray-900 px-3 py-1.5 rounded-md border border-gray-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 flex justify-center items-start">
        
        <div className="w-full max-w-5xl bg-[#0E1117] border border-gray-700/60 rounded-xl shadow-2xl overflow-hidden flex flex-col mt-4">
          
          <div className="h-12 bg-[#161B22] border-b border-gray-800 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-600"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-600"></div>
            </div>

            <div className="text-xs text-gray-400 font-mono flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              README.md - {repoUrl.split('/').slice(-2).join('/') || 'repo'}
            </div>

            <div className="flex items-center gap-2">
              {generatedMarkdown && !isGenerating && (
                <>
                  <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
                    <button 
                      onClick={() => setViewMode('preview')}
                      className={`px-3 py-1 text-xs rounded-md transition-all font-medium ${viewMode === 'preview' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                      Preview
                    </button>
                    <button 
                      onClick={() => setViewMode('code')}
                      className={`px-3 py-1 text-xs rounded-md transition-all font-medium ${viewMode === 'code' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                      Raw Code
                    </button>
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="p-1.5 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors"
                    title="Copy to Clipboard"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Terminal body */}
          <div className="min-h-[500px] p-6 text-sm flex flex-col">
            
            {!isGenerating && !generatedMarkdown && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Generate Auto-README</h3>
                <p className="text-gray-400 max-w-md mb-8">
                  CodeLens AI will analyze your vectors in MongoDB and automatically draft a professional, comprehensive README.md file <span className="text-blue-400 font-mono"></span>.
                </p>
                <button 
                  onClick={handleGenerate}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-purple-600/20 flex items-center gap-2 group"
                >
                  <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Initialize Generation
                </button>
              </div>
            )}

            {isGenerating && (
              <div className="font-mono text-gray-300 space-y-2">
                {logs.map((log, i) => (
                  <div key={i} className="animate-fade-in-up flex items-start gap-3">
                    <span className="text-green-400 shrink-0">➜</span>
                    <span className={i === logs.length - 1 ? 'animate-pulse text-purple-400' : ''}>{log}</span>
                  </div>
                ))}
                <div className="flex gap-1 mt-4 ml-6">
                  <span className="w-2.5 h-4 bg-gray-400 animate-ping"></span>
                </div>
              </div>
            )}

            {!isGenerating && generatedMarkdown && (
              <div className="flex-1 w-full max-w-4xl mx-auto">
                {viewMode === 'preview' ? (
                  <div className="prose prose-invert prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-gray-800 max-w-none">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({node, inline, className, children, ...props}) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              customStyle={{ margin: 0, background: 'transparent' }}
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className="bg-gray-800 text-purple-300 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                              {children}
                            </code>
                          )
                        }
                      }}
                    >
                      {generatedMarkdown}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <textarea 
                    readOnly
                    value={generatedMarkdown}
                    className="w-full h-full min-h-[500px] bg-transparent text-gray-300 font-mono text-sm resize-none focus:outline-none scrollbar-hide"
                  />
                )}
              </div>
            )}
            
          </div>
          
          {!isGenerating && generatedMarkdown && (
             <div className="p-4 border-t border-gray-800 bg-[#161B22] flex justify-end">
               <button 
                  onClick={handleGenerate}
                  className="text-xs text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  Regenerate README
                </button>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AutoReadme;