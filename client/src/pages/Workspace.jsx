import React, { useState } from 'react';

const Workspace = () => {
  // Mock data for the repository file tree (MERN Stack example)
  const fileTree = [
    { name: 'client', type: 'folder', isOpen: true, children: [
      { name: 'src', type: 'folder', isOpen: true, children: [
        { name: 'components', type: 'folder', isOpen: false, children: [] },
        { name: 'App.jsx', type: 'file' },
        { name: 'main.jsx', type: 'file' },
      ]},
      { name: 'package.json', type: 'file' },
    ]},
    { name: 'server', type: 'folder', isOpen: false, children: [
      { name: 'models', type: 'folder', isOpen: false, children: [] },
      { name: 'routes', type: 'folder', isOpen: false, children: [] },
      { name: 'index.js', type: 'file' },
    ]},
    { name: 'docker-compose.yml', type: 'file' },
    { name: 'README.md', type: 'file' },
  ];

  const [inputMessage, setInputMessage] = useState('');

  // Recursive component to render the file tree
  const FileNode = ({ node, depth = 0 }) => {
    const isFolder = node.type === 'folder';
    return (
      <div>
        <div 
          className={`flex items-center py-1 px-2 hover:bg-gray-800/50 cursor-pointer text-sm rounded-md transition-colors ${depth === 0 ? 'mt-1' : ''}`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {isFolder ? (
            <svg className="w-4 h-4 text-blue-400 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          )}
          <span className={`truncate ${isFolder ? 'text-gray-200' : 'text-gray-400'}`}>
            {node.name}
          </span>
        </div>
        {isFolder && node.isOpen && node.children && (
          <div>
            {node.children.map((child, index) => (
              <FileNode key={index} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#0E1117] text-gray-300 font-sans overflow-hidden">
      
      {/* LEFT SIDE: AI Chat Workspace (Terminal Like) */}
      <main className="flex-1 flex flex-col relative min-w-0">
        
        {/* Workspace Header */}
        <header className="h-14 border-b border-gray-800 flex items-center justify-between px-6 shrink-0 bg-[#0E1117]/95 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-600/20 text-blue-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </span>
            <h1 className="font-semibold text-gray-200 text-sm">CodeLens AI Session</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-800 text-gray-400 border border-gray-700">gpt-4o</span>
          </div>
          <button className="text-gray-500 hover:text-gray-300 transition-colors text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Reset Context
          </button>
        </header>

        {/* Chat Message Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          
          {/* AI Welcome Message */}
          <div className="flex gap-4 max-w-3xl mx-auto">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M22 22l-6-6M10 16a6 6 0 100-12 6 6 0 000 12z" /></svg>
            </div>
            <div className="flex-1 space-y-2 pt-1">
              <p className="text-gray-300 leading-relaxed text-sm">
                I've finished indexing your repository <span className="font-mono text-blue-400 bg-blue-900/20 px-1.5 py-0.5 rounded">markme-attendance</span>. 
                There are 42 files across the MERN stack. How can I help you understand this codebase?
              </p>
              <div className="flex gap-2 mt-3">
                <button className="text-xs px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 transition-colors">
                  Explain the auth flow
                </button>
                <button className="text-xs px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 transition-colors">
                  Find database schemas
                </button>
              </div>
            </div>
          </div>

          {/* User Message Example */}
          <div className="flex gap-4 max-w-3xl mx-auto flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shrink-0 text-white font-bold text-xs">
              FS
            </div>
            <div className="flex-1 pt-1 flex justify-end">
              <div className="bg-gray-800 px-4 py-2.5 rounded-lg rounded-tr-none border border-gray-700 inline-block">
                <p className="text-gray-200 text-sm">Where are the React contexts located?</p>
              </div>
            </div>
          </div>

        </div>

        {/* Prompt Input Area */}
        <div className="p-4 bg-gradient-to-t from-[#0E1117] via-[#0E1117] to-transparent shrink-0 pt-8 border-t border-gray-800/50">
          <div className="max-w-3xl mx-auto relative group">
            <textarea 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything about your codebase..." 
              className="w-full bg-[#161B22] border border-gray-700 rounded-xl px-4 py-3.5 pr-12 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none overflow-hidden h-[52px]"
              rows={1}
            />
            <button className="absolute right-2 top-2 p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
          <p className="text-center text-[11px] text-gray-500 mt-3 font-medium">
            CodeLens AI can make mistakes. Verify critical code.
          </p>
        </div>

      </main>

      {/* RIGHT SIDE: Repository Directory Tree */}
      <aside className="w-72 lg:w-80 bg-[#161B22] border-l border-gray-800 flex flex-col shrink-0 hidden md:flex">
        
        {/* Tree Header */}
        <div className="h-14 border-b border-gray-800 flex items-center justify-between px-4 shrink-0">
          <h2 className="font-semibold text-gray-300 text-sm tracking-wide">Repository Explorer</h2>
          <div className="flex gap-1">
            <button className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors" title="Refresh">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
            <button className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors" title="Collapse All">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
            </button>
          </div>
        </div>

        {/* Tree Content */}
        <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
          <div className="px-2 py-1.5 mb-2 flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
            markme-attendance
          </div>
          
          {/* Render Recursive Tree */}
          {fileTree.map((node, index) => (
            <FileNode key={index} node={node} />
          ))}
        </div>

      </aside>

    </div>
  );
};

export default Workspace;