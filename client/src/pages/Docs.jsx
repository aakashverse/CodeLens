export default function Docs() {
  return (
    <>
      <div className="min-h-screen w-full bg-[#0d1117] text-gray-300 font-mono selection:bg-pink-500/30 flex flex-col items-center justify-center p-4 sm:p-8 md:p-16">
        
        <div className="w-full max-w-6xl">
          
          {/* Header */}
          <div className="flex items-center text-xs text-gray-500 border-b border-gray-800 pb-4 mb-8 sm:mb-12">
            <div className="flex space-x-2 mr-6">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <span>~/codelens/intro.tsx</span>
          </div>

          {/* Intro Context */}
          <div className="mb-16">
            <p className="text-gray-500 mb-3 text-sm sm:text-base">
              <span className="text-green-400">codelens</span>@<span className="text-blue-400">rag-engine</span> <span className="text-yellow-300">~</span> $ ./start.sh
            </p>
            <p className="text-gray-400 text-lg md:text-xl max-w-3xl leading-relaxed border-l-2 border-gray-700 pl-4">
              <span className="text-gray-600 italic">// Turn messy, undocumented GitHub repositories into instantly queryable knowledge bases using Generative AI.</span>
            </p>
          </div>

          {/* Updated & Aligned RAG Architecture Diagram */}
          <div className="mb-16 bg-[#161b22]/50 rounded-xl p-8 border border-gray-800/80 backdrop-blur-sm shadow-2xl overflow-hidden">
            <div className="text-gray-500 text-xs uppercase tracking-widest mb-6 border-b border-gray-800 pb-2">
              System.Architecture.Graph
            </div>
            <div className="overflow-x-auto pb-4">
              <pre className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
{`[ `}<span className="text-blue-400 font-bold">GitHub Repo</span>{` ] ──> < `}<span className="text-purple-400">Indexed?</span>{` > ──(Yes)──> [ `}<span className="text-orange-400 font-bold">Prompt User</span>{` ] ──(Reuse)──┐
                          │                       │                    │
                        (No)                  (Re-index)               │
                          │                       │                    │
                          ▼                       ▼                    ▼
                ( `}<span className="text-yellow-400">Chunking & Embedding</span>{` ) ─────────────────> [ `}<span className="text-green-400 font-bold">Vector Database</span>{` ]
                                                                       │
                                                                       │
                                                                       ▼
[ `}<span className="text-cyan-400 font-bold">User Query</span>{`  ] ──────────────────────────────────────────> ( `}<span className="text-pink-400">Similarity Search</span>{` )
                                                                       │
                                                                       │ `}<span className="text-gray-500 italic">top-k context</span>{`
                                                                       ▼
                                                                [ `}<span className="text-blue-400 font-bold">Google GenAI</span>{` ]
                                                                       │
                                                                       ▼
                                                           [ `}<span className="text-green-400 font-bold">Context-Aware Answer</span>{` ]`}
              </pre>
            </div>
          </div>

          {/* Loading Indicator */}
          <div className="text-gray-500 mb-6 text-sm">
             Loading modules <span className="text-cyan-400 animate-pulse">...</span>
          </div>
          
          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-[#161b22] p-6 sm:p-8 rounded-xl border border-gray-800 hover:border-cyan-500/50 hover:bg-[#1c2128] transition-all group">
              <div className="text-cyan-400 mb-3 text-lg font-bold group-hover:scale-105 transform origin-left transition-transform">
                <span className="text-pink-500 text-sm mr-2">01</span>{"<CodeLens_Chat />"}
              </div>
              <p className="text-gray-300 font-medium mb-3">
                chatNaturally(<span className="text-blue-300">repoContext</span>);
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Find endpoints, variables, and undocumented logic without manually digging through thousands of files.
              </p>
            </div>

            <div className="bg-[#161b22] p-6 sm:p-8 rounded-xl border border-gray-800 hover:border-red-500/50 hover:bg-[#1c2128] transition-all group">
              <div className="text-red-400 mb-3 text-lg font-bold group-hover:scale-105 transform origin-left transition-transform">
                <span className="text-pink-500 text-sm mr-2">02</span>{"<PR_BlastRadius />"}
              </div>
              <p className="text-gray-300 font-medium mb-3">
                analyzePullRequest(<span className="text-blue-300">incomingDiff</span>);
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Prevent bugs before merging by automatically finding all affected files tied to an incoming PR.
              </p>
            </div>

            <div className="bg-[#161b22] p-6 sm:p-8 rounded-xl border border-gray-800 hover:border-yellow-500/50 hover:bg-[#1c2128] transition-all group">
              <div className="text-yellow-400 mb-3 text-lg font-bold group-hover:scale-105 transform origin-left transition-transform">
                <span className="text-pink-500 text-sm mr-2">03</span>{"<Architecture_Map />"}
              </div>
              <p className="text-gray-300 font-medium mb-3">
                visualizeDependencies(<span className="text-blue-300">systemGraph</span>);
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Instantly visualize complex module relationships and hidden file dependencies in a clean node map.
              </p>
            </div>

            <div className="bg-[#161b22] p-6 sm:p-8 rounded-xl border border-gray-800 hover:border-green-500/50 hover:bg-[#1c2128] transition-all group">
              <div className="text-green-400 mb-3 text-lg font-bold group-hover:scale-105 transform origin-left transition-transform">
                <span className="text-pink-500 text-sm mr-2">04</span>{"<Auto_Readme />"}
              </div>
              <p className="text-gray-300 font-medium mb-3">
                generateDocs(<span className="text-blue-300">indexedContext</span>);
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Use indexed context to generate highly accurate, Markdown-ready documentation in seconds.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}