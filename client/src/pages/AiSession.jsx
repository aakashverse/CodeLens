import React, { useState, useEffect } from 'react';
import GithubConnectForm from '../components/GithubConnectForm';

const AiSession = () => {
  // States: 'input', 'cloning', 'workspace'
  const [sessionState, setSessionState] = useState('input');
  const [repoUrl, setRepoUrl] = useState('');
  const [loadingText, setLoadingText] = useState('');
  const [chatInput, setChatInput] = useState('');

  // Simulated File Tree Data
  const fileTree = [
    { name: 'src', type: 'folder', isOpen: true, children: [
      { name: 'components', type: 'folder', isOpen: false, children: [] },
      { name: 'App.jsx', type: 'file' },
    ]},
    { name: 'package.json', type: 'file' },
    { name: 'README.md', type: 'file' },
  ];

  // Handle URL Submission & Fake Loading Sequence
  const handleConnect = (url) => {
    setRepoUrl(url);
    setSessionState('cloning');
    
    // Simulate terminal cloning steps
    const steps = [
      "Cloning repository...",
      "Resolving dependencies...",
      "Parsing Abstract Syntax Trees (AST)...",
      "Indexing vector database...",
      "Ready."
    ];
    
    let stepIndex = 0;
    setLoadingText(steps[0]);

    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setLoadingText(steps[stepIndex]);
      } else {
        clearInterval(interval);
        setSessionState('workspace'); // Transition to split screen
      }
    }, 800); // 800ms per step
  };

  // Helper for Tree Rendering
  const renderTree = (nodes, depth = 0) => {
    return nodes.map((node, i) => (
      <div key={i}>
        <div 
          className="flex items-center py-1.5 px-2 hover:bg-gray-800/50 cursor-pointer text-sm rounded-md transition-colors"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {node.type === 'folder' ? (
            <svg className="w-4 h-4 text-blue-400 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
          ) : (
            <svg className="w-4 h-4 text-gray-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
          )}
          <span className={node.type === 'folder' ? 'text-gray-200' : 'text-gray-400'}>{node.name}</span>
        </div>
        {node.children && node.isOpen && renderTree(node.children, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="flex flex-col h-screen bg-[#0A0D14] font-sans">
      
      {/* Top Navigation Bar for the Tool */}
      <header className="h-14 border-b border-gray-800 bg-[#11151D] flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center text-blue-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </div>
          <h1 className="font-semibold text-gray-200 text-sm">CodeLens AI Session</h1>
        </div>
        {repoUrl && (
          <div className="text-xs text-gray-500 flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-full border border-gray-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {repoUrl.split('/').slice(-2).join('/')}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* View 1: Input / Loading State */}
        {(sessionState === 'input' || sessionState === 'cloning') && (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-[#0A0D14] z-20">
            <GithubConnectForm 
              onSubmit={handleConnect} 
              isLoading={sessionState === 'cloning'} 
              loadingText={loadingText} 
            />
          </div>
        )}

        {/* View 2: Split Workspace (Only visible when ready) */}
        {sessionState === 'workspace' && (
          <>
            {/* LEFT SIDE: Terminal Chat */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#0E1117] border-r border-gray-800">
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                
                {/* AI Welcome Message */}
                <div className="flex gap-4 max-w-3xl mx-auto">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/20">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div className="flex-1 pt-1 font-mono">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      &gt; Repository successfully indexed. <br/>
                      &gt; Found <span className="text-blue-400">React</span> frontend and <span className="text-green-400">Node.js</span> backend.<br/>
                      <br/>
                      How can I help you understand this codebase?
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4 font-sans">
                      <button className="text-xs px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 transition-colors">Explain architecture</button>
                      <button className="text-xs px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 transition-colors">Find authentication logic</button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Chat Input Bar */}
              <div className="p-4 bg-[#0A0D14] border-t border-gray-800 shrink-0">
                <div className="max-w-3xl mx-auto relative group flex items-center">
                  <span className="absolute left-4 text-blue-500 font-mono font-bold">&gt;</span>
                  <input 
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask anything about the code..." 
                    className="w-full bg-[#161B22] border border-gray-700 rounded-lg py-3 pl-10 pr-12 text-sm font-mono text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                  <button className="absolute right-2 p-1.5 rounded-md bg-blue-600/20 text-blue-500 hover:bg-blue-600 hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </div>
                <p className="text-center text-[11px] text-gray-500 mt-3 font-medium">
                    CodeLens AI can make mistakes. Verify critical code.
                </p>
              </div>
            </main>

            {/* RIGHT SIDE: Repo Tree Viewer */}
            <aside className="w-72 lg:w-80 bg-[#161B22] flex flex-col shrink-0 hidden md:flex">
              <div className="h-10 border-b border-gray-800 flex items-center px-4 shrink-0 bg-[#11151D]">
                <h2 className="font-semibold text-gray-400 text-[11px] uppercase tracking-wider">Directory Tree</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-3 scrollbar-hide">
                <div className="px-2 py-1 mb-2 flex items-center gap-2 text-xs font-bold text-gray-300">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                  {repoUrl ? repoUrl.split('/').pop() : 'project-root'}
                </div>
                {renderTree(fileTree)}
              </div>
            </aside>
          </>
        )}

      </div>
        
    </div>
  );
};

export default AiSession;