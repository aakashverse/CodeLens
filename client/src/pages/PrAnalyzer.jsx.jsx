import { useContext } from 'react';
import { usePr } from '../hooks/usePr';
import { PrAnalyzerContext } from '../context/pr.context';

export default function PRAnalyzer() {
  const context = useContext(PrAnalyzerContext);
  const { prUrl, setPrUrl, loading, analysis, error } = context;
  const { handleAnalyze } = usePr();

  return (
    <div className="flex flex-col h-screen bg-[#0A0D14] font-sans text-gray-200">
      {/* Consistent Header */}
      <header className="h-14 border-b border-gray-800 bg-[#11151D] flex items-center justify-between px-6 shrink-0">
        <h1 className="font-semibold text-sm flex items-center gap-2">
          <span className="text-blue-500">🔍</span> PR Lens & Blast Radius
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Input Window */}
          <div className="bg-[#11151D] border border-gray-800 rounded-lg overflow-hidden shadow-xl">
             <div className="h-10 bg-[#0E1117] border-b border-gray-800 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
             </div>
             <form onSubmit={handleAnalyze} className="p-6">
               <div className="flex gap-4">
                 <input
                   type="text"
                   value={prUrl}
                   onChange={(e) => setPrUrl(e.target.value)}
                   placeholder="https://github.com/owner/repo/pull/123"
                   className="w-full bg-[#0A0D14] border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all"
                   required
                 />
                 <button
                   type="submit"
                   disabled={loading}
                   className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900/50 text-white px-6 py-2 rounded-lg font-medium transition-all text-sm min-w-[120px]"
                 >
                   {loading ? 'Analyzing...' : 'Analyze PR'}
                 </button>
               </div>
             </form>
          </div>

          {error && (
            <div className="border border-red-900 bg-red-950/20 text-red-400 p-4 rounded-lg text-sm">
              [!] {error}
            </div>
          )}

          {/* Results Area */}
          {analysis && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="bg-[#11151D] border border-gray-800 rounded-lg p-6">
                <h3 className="text-xs text-blue-400 mb-3 uppercase tracking-wider font-semibold">TL;DR</h3>
                <p className="text-gray-300 leading-relaxed text-sm">{analysis?.tldr}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#11151D] border border-gray-800 rounded-lg p-6">
                  <h3 className="text-xs text-emerald-400 mb-4 uppercase tracking-wider font-semibold">Key Changes</h3>
                  <ul className="space-y-3">
                    {analysis?.keyChanges.map((change, idx) => (
                      <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                        <span className="text-emerald-700">➜</span> {change}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#11151D] border border-gray-800 rounded-lg p-6">
                  <h3 className="text-xs text-amber-500 mb-4 uppercase tracking-wider font-semibold">Blast Radius</h3>
                  {analysis?.blastRadius.length > 0 ? (
                    <ul className="space-y-3">
                      {analysis?.blastRadius.map((risk, idx) => (
                        <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                          <span className="text-amber-700">!</span> {risk}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600 text-sm italic">Status: Stable</p>
                  )}
                </div>
              </div>

              {analysis?.localTesting && (
                <div className="bg-[#0E1117] border border-gray-800 rounded-lg overflow-hidden">
                  <div className="px-4 py-2 border-b border-gray-800 text-xs text-gray-500 font-mono">test_script.sh</div>
                  <pre className="p-4 text-emerald-400 text-sm overflow-x-auto font-mono">
                    <code>{analysis?.localTesting}</code>
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}