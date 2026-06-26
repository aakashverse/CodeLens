import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import { useAnalyzer } from '../hooks/useAnalyzer';
import { AnalyzerContext } from '../context/analyzer.context';
import { WorkspaceContext } from '../context/workspace.context';
import useToast from '../hooks/useToast';

const Analyzer = () => {
  const navigate = useNavigate();
  const context = useContext(AnalyzerContext);
  
  const { isDetecting, detectedResults, logs } = context; 
  const {showSuccess} = useToast();
  const { resetSession } = useContext(WorkspaceContext);
  const { handleAnalyzeCode } = useAnalyzer();

  const [activeTab, setActiveTab] = useState('all'); 

  const handleDisconnect = async() => {
    await resetSession();
    showSuccess("Session Terminated.")
    navigate('/');
  }

  // get color classes based on severity
  const getSeverityStyles = (severity) => {
    switch(severity) {
      case 'high': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0A0D14] font-sans">
      
      <header className="h-14 border-b border-gray-800 bg-[#11151D] flex items-center justify-between px-6 shrink-0">
        <h1 className="font-semibold text-gray-200 text-sm flex items-center gap-2">
          <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          Code Smell
        </h1>
         <div className="flex items-center gap-4">
          <div className="text-xs text-gray-400 bg-gray-900 px-3 py-1.5 rounded-md border border-gray-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            {/* {sessionState} */}
          </div>
          <button 
            onClick={handleDisconnect}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors"
          >
            Disconnect
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          <div className="flex items-center justify-between bg-[#11151D] border border-gray-800 rounded-xl p-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Codebase Analysis</h2>
              <p className="text-gray-400 mt-1 text-sm">Scan components, routes, and database queries for hidden bottlenecks.</p>
            </div>
            <button 
              onClick={handleAnalyzeCode}
              disabled={isDetecting}
              className="bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDetecting ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
              )}
              {isDetecting ? 'Analyzing Vectors...' : 'Deep Scan'}
            </button>
          </div>

          {!isDetecting && !detectedResults && (
            <div className="border border-dashed border-gray-800 rounded-xl p-16 flex flex-col items-center justify-center text-center bg-[#0d1117]/50">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4 border border-gray-800">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <h3 className="text-lg font-medium text-gray-300">Ready to inspect</h3>
              <p className="text-gray-500 mt-2 max-w-sm">Initiate a deep scan to uncover redundant MongoDB queries, unnecessary re-renders, and structural anti-patterns.</p>
            </div>
          )}

          {isDetecting && (
            <div className="bg-[#11151D] border border-gray-800 rounded-xl p-8">
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden">
                   <div className="bg-cyan-500 h-2 rounded-full animate-pulse w-2/3 transition-all duration-1000"></div>
                 </div>
                 <span className="text-cyan-400 font-mono text-sm">67%</span>
               </div>
               <div className="font-mono text-xs text-gray-400 space-y-2 pl-2 border-l-2 border-gray-800 h-32 overflow-hidden">
                 {logs.map((log, i) => (
                   <div key={i} className="animate-fade-in-up text-gray-500">{log}</div>
                 ))}
                 <div className="text-cyan-400 flex items-center gap-2 mt-2">
                   <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                   Analyzing syntax trees...
                 </div>
               </div>
            </div>
          )}

          {!isDetecting && detectedResults && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up">
              
              <div className="md:col-span-1 space-y-4">
                <div className="bg-[#11151D] border border-gray-800 rounded-xl p-6 text-center relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-full h-1 ${detectedResults.healthScore > 80 ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                  <div className="text-5xl font-bold text-white mb-2">{detectedResults.healthScore}</div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Health Score</div>
                </div>

                <div className="bg-[#11151D] border border-gray-800 rounded-xl p-2 flex flex-col gap-1">
                  {['all', 'high', 'medium', 'low'].map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-sm rounded-lg text-left capitalize transition-colors ${activeTab === tab ? 'bg-gray-800 text-white font-medium' : 'text-gray-400 hover:bg-gray-900/50 hover:text-gray-300'}`}
                    >
                      {tab === 'all' ? 'All Issues' : `${tab} Severity`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-3 bg-[#11151D] border border-gray-800 rounded-xl overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-gray-800 bg-[#161b22] flex justify-between items-center">
                  <h3 className="font-medium text-gray-200">Detected Anomalies</h3>
                  <span className="text-xs text-gray-500 font-mono">{detectedResults?.issues?.length} total issues</span>
                </div>
                
                <div className="divide-y divide-gray-800/50 max-h-[500px] overflow-y-auto">
                  {detectedResults.issues
                    .filter(issue => activeTab === 'all' || issue.severity === activeTab)
                    .map((issue, idx) => (
                    <div key={idx} className="p-5 hover:bg-gray-900/20 transition-colors group">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${getSeverityStyles(issue.severity)}`}>
                            {issue.severity}
                          </span>
                          <span className="text-sm font-medium text-gray-300">{issue.type}</span>
                        </div>
                        <span className="text-xs font-mono text-gray-500 group-hover:text-cyan-400 transition-colors">
                          {issue.file} {issue.line && `:${issue.line}`}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {issue.message}
                      </p>
                    </div>
                  ))}
                  
                  {detectedResults.issues.filter(i => activeTab === 'all' || i.severity === activeTab).length === 0 && (
                    <div className="p-8 text-center text-gray-500 italic text-sm">
                      No issues found in this category. Great job!
                    </div>
                  )}
                </div>
              </div>
              
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Analyzer;