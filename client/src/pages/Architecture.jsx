import { useContext } from 'react';
import { useAiSession } from '../hooks/useAi-session';
import { ArchitectureContext } from '../context/architecture.context';
import { useArchitecture } from '../hooks/useArchitecture';
import MermaidDiagram from '../components/MermaidDiagram';
import { generateMermaidSyntax } from '../hooks/useArchitecture';

const ViewArchitecture = () => {
  const { activeWorkspace } = useAiSession();
  const context = useContext(ArchitectureContext);

  const {isAnalyzing, architectureData, logs} = context;

  const {handleAnalyze} = useArchitecture();

  return (
    <div className="flex flex-col h-screen bg-[#0A0D14] font-sans">
      
      <header className="h-14 border-b border-gray-800 bg-[#11151D] flex items-center justify-between px-6 shrink-0">
        <h1 className="font-semibold text-gray-200 text-sm flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          Architecture Explorer
        </h1>
        
        <div className="flex items-center gap-4">
          <div className="text-xs text-gray-400 bg-gray-900 px-3 py-1.5 rounded-md border border-gray-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            {activeWorkspace}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">

        <main className="flex-1 bg-[#0A0D14] flex flex-col p-8 overflow-y-auto relative">
          
          {!isAnalyzing && !architectureData && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Map Architecture</h3>
              <p className="text-gray-400 max-w-md mb-8">
                CodeLens AI will scan the vectors of <span className="text-blue-400 font-mono">{activeWorkspace}</span> to generate a high-level system diagram and dependency graph.
              </p>
              <button 
                onClick={handleAnalyze}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 group"
              >
                <svg className="w-5 h-5 group-hover:animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Begin Analysis
              </button>
            </div>
          )}

          {/* analyze window */}
          {isAnalyzing && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-full max-w-2xl bg-[#0E1117] border border-gray-700/60 rounded-xl shadow-2xl overflow-hidden flex flex-col">
                <div className="h-10 bg-[#161B22] border-b border-gray-800 flex items-center px-4 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                </div>
                <div className="p-6 font-mono text-sm text-gray-300 space-y-3 min-h-[300px]">
                  {logs.map((log, i) => (
                    <div key={i} className="animate-fade-in-up flex items-start gap-3">
                      <span className="text-emerald-400 shrink-0">➜</span>
                      <span className={i === logs.length - 1 ? 'animate-pulse text-gray-100' : 'text-gray-400'}>{log}</span>
                    </div>
                  ))}
                  <div className="flex gap-1 mt-4 ml-6">
                    <span className="w-2.5 h-4 bg-gray-400 animate-ping"></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          
  {architectureData && (
  <div className="flex-1 flex flex-col animate-fade-in-up">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">System Architecture</h2>
        <p className="text-gray-400 mt-1">High-level component breakdown and data flow.</p>
      </div>

      <div className="bg-[#0b0e14] border border-gray-800 rounded-xl p-4 mb-8">
       <MermaidDiagram chart={generateMermaidSyntax(architectureData)} />
      </div>

    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
    
      <div className="bg-[#11151D] border border-blue-900/50 rounded-xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <h3 className="font-semibold text-gray-200">Client / Frontend</h3>
        </div>
        <div className="space-y-2 font-mono text-xs">
          {architectureData.frontend?.length > 0 ? (
            architectureData.frontend.map((tech, index) => (
              <div key={index} className="bg-gray-900/50 border border-gray-800 p-2 rounded text-blue-300">
                {tech}
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic">None detected</div>
          )}
        </div>
      </div>

      
      <div className="hidden md:flex items-center justify-center text-gray-700">
        <svg className="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
      </div>

      
      <div className="bg-[#11151D] border border-green-900/50 rounded-xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/10 transition-colors"></div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
          </div>
          <h3 className="font-semibold text-gray-200">Server / Backend</h3>
        </div>
        <div className="space-y-2 font-mono text-xs">
          {architectureData.backend?.length > 0 ? (
            architectureData.backend.map((tech, index) => (
              <div key={index} className="bg-gray-900/50 border border-gray-800 p-2 rounded text-green-300">
                {tech}
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic">None detected</div>
          )}
        </div>
      </div>

    </div>

    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      
      
      <div className="bg-[#11151D] border border-purple-900/50 rounded-xl p-6 relative overflow-hidden group text-center flex flex-col items-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
          </div>
          <h3 className="font-semibold text-gray-200">Database Layer</h3>
        </div>
        <div className="space-y-2 font-mono text-xs w-full">
          {architectureData.database?.length > 0 ? (
            architectureData.database.map((tech, index) => (
              <div key={index} className="bg-gray-900/50 border border-gray-800 p-2 rounded text-purple-300">
                {tech}
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic">None detected</div>
          )}
        </div>
      </div>

      
      <div className="bg-[#11151D] border border-orange-900/50 rounded-xl p-6 relative overflow-hidden group text-center flex flex-col items-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
            <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
          </div>
          <h3 className="font-semibold text-gray-200">Cloud & Infra</h3>
        </div>
        <div className="space-y-2 font-mono text-xs w-full">
          {architectureData.cloud?.length > 0 ? (
            architectureData.cloud.map((tech, index) => (
              <div key={index} className="bg-gray-900/50 border border-gray-800 p-2 rounded text-orange-300">
                {tech}
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic">None detected</div>
          )}
        </div>
      </div>

    </div>

   
    {architectureData.tree?.length > 0 && (
      <div className="bg-[#0b0e14] border border-gray-800 rounded-xl p-6 mb-8">
        <h3 className="font-semibold text-gray-400 mb-4 text-sm uppercase tracking-wider">Root Structure</h3>
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          {architectureData.tree.map((path, index) => (
            <span key={index} className="px-3 py-1 bg-gray-900 border border-gray-700 rounded-full text-gray-400">
              📁 {path}
            </span>
          ))}
        </div>
      </div>
    )}
    
        <div className="mt-auto flex justify-end">
          <button onClick={handleAnalyze} className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Re-analyze Architecture
          </button>
        </div>

      </div>
    )}
      </main>
      </div>
    </div>
  );
};

export default ViewArchitecture;