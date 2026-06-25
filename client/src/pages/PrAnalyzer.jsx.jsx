import { useContext } from 'react';
import { usePr } from '../hooks/usePr';
import { PrAnalyzerContext } from '../context/pr.context';

export default function PRAnalyzer() {
  const context = useContext(PrAnalyzerContext);
  const {prUrl, setPrUrl, loading, analysis, error} = context;
  const {handleAnalyze} = usePr();
  
  return (
    <div className="min-h-screen bg-[#0A0D14] text-gray-200 p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            PR Lens & Blast Radius
          </h1>
          <p className="text-gray-400">
            Paste a GitHub Pull Request URL to instantly understand the changes, context, and potential breaking points.
          </p>
        </div>

        {/* Input Section */}
        <form onSubmit={handleAnalyze} className="relative">
          <div className="flex gap-4">
            <input
              type="text"
              value={prUrl}
              onChange={(e) => setPrUrl(e.target.value)}
              placeholder="https://github.com/owner/repo/pull/123"
              className="w-full bg-[#11151D] border border-gray-700/50 rounded-xl px-5 py-4 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-medium transition-colors flex items-center justify-center min-w-[140px]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing
                </span>
              ) : (
                'Analyze PR'
              )}
            </button>
          </div>
        </form>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl flex items-start gap-3">
            <span className="mt-0.5">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Results Section */}
        {analysis && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* TL;DR Box */}
            <div className="bg-gradient-to-br from-[#11151D] to-[#0D1017] border border-blue-900/30 rounded-2xl p-6 shadow-lg">
              <h3 className="text-sm uppercase tracking-wider font-bold text-blue-400 mb-3 flex items-center gap-2">
                <span>⚡</span> TL;DR
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                {analysis.tldr}
              </p>
            </div>

            {/* Grid for Key Changes & Blast Radius */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Key Changes */}
              <div className="bg-[#11151D] border border-emerald-900/20 rounded-2xl p-6">
                <h3 className="text-sm uppercase tracking-wider font-bold text-emerald-400 mb-4 flex items-center gap-2">
                  <span>✨</span> Key Changes
                </h3>
                <ul className="space-y-3">
                  {analysis.keyChanges?.map((change, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-300">
                      <span className="text-emerald-500/50 mt-1">➔</span>
                      <span className="leading-relaxed">{change}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Blast Radius */}
              <div className="bg-[#11151D] border border-amber-900/20 rounded-2xl p-6">
                <h3 className="text-sm uppercase tracking-wider font-bold text-amber-400 mb-4 flex items-center gap-2">
                  <span>🎯</span> Blast Radius
                </h3>
                {analysis.blastRadius?.length > 0 ? (
                  <ul className="space-y-3">
                    {analysis.blastRadius.map((risk, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-300">
                        <span className="text-amber-500/50 mt-1">⚠️</span>
                        <span className="leading-relaxed">{risk}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No major side effects detected.</p>
                )}
              </div>
            </div>

            {/* Local Testing Terminal */}
            {analysis.localTesting && (
              <div className="bg-[#0D1017] border border-gray-800 rounded-2xl overflow-hidden">
                <div className="bg-[#1A1D24] px-4 py-2 flex items-center gap-2 border-b border-gray-800">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  <span className="ml-2 text-xs text-gray-500 font-mono">Local Testing Commands</span>
                </div>
                <div className="p-4 overflow-x-auto">
                  <pre className="font-mono text-sm text-emerald-400 whitespace-pre-wrap">
                    <code>{analysis.localTesting}</code>
                  </pre>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}