import { useContext } from "react";
import { useNavigate } from "react-router";
import { AiSessionContext } from "../context/ai-session.context";
import { useAuth } from "../hooks/useAuth"; 
import Navbar from "../components/Navbar";
import useToast from "../hooks/useToast";

const Dashboard = () => {
  const { repoUrl, resetSession, selectedModel} = useContext(AiSessionContext);
  const { user } = useAuth(); 
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const repoName = repoUrl ? repoUrl.split('/').pop().replace('.git', '') : 'No Repository';
  
  const isApiConnected = user?.hasApiKey;
  const currentModel = user?.aiModel;

  const tools = [
    {
      id: 'chat-codebase',
      title: 'CodeLens AI',
      goTo: '/ai-session',
      description: 'Chat with your repository. Instantly trace data flows and understand complex logic using GenAI.',
      icon: (
        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
      ),
      bgGradient: 'from-blue-500/10 to-indigo-500/10',
      borderHover: 'hover:border-blue-500/50',
      badge: 'Popular',
      tags: ['Code Review', 'RAG Pipeline', 'Semantic Search']
    },
    {
      id: 'architecture',
      title: 'Architecture Viewer',
      goTo: '/architecture',
      description: 'Visualize your entire codebase as an interactive node graph. See how components and routes connect.',
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
      ),
      bgGradient: 'from-purple-500/10 to-fuchsia-500/10',
      borderHover: 'hover:border-purple-500/50',
      badge: 'Beta',
      tags: ['Dependency Graph', 'Visualization']
    },
    {
      id: 'smell-detector',
      title: 'Code Smell Detector',
      goTo: '/analyze-code',
      description: 'Scan your files for anti-patterns, redundant queries, and performance bottlenecks before you deploy.',
      icon: (
        <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      ),
      bgGradient: 'from-rose-500/10 to-orange-500/10',
      borderHover: 'hover:border-rose-500/50',
      badge: 'Essential',
      tags: ['Performance', 'Optimization', 'Security']
    },
    {
      id: 'auto-readme',
      title: 'Auto-README Generator',
      goTo: '/readme',
      description: 'Automatically scan your tech stack and generate comprehensive, beautifully formatted documentation.',
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      ),
      bgGradient: 'from-amber-500/10 to-amber-500/10',
      borderHover: 'hover:border-amber-500/50',
      badge: 'Time Saver',
      tags: ['Documentation', 'Automation', 'AST']
    },
     {
      id: 'pr-lens',
      title: 'PR Lens & Blast Radius',
      goTo: '/analyze-pr',
      description: 'Paste a Pull Request URL to decode complex diffs, auto-generate testing commands, and detect breaking changes before merging.',
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v10M8 7a2 2 0 100-4 2 2 0 000 4zm0 10a2 2 0 100 4 2 2 0 000-4zm8-10v.01M16 7a2 2 0 100-4 2 2 0 000 4zm0 0c0 3-2 5-5 5H8" />
        </svg>
      ),
      bgGradient: 'from-emerald-500/10 to-teal-500/10',
      borderHover: 'hover:border-emerald-500/50',
      badge: '🔥 High Impact',
      tags: ['PR Review', 'Risk Analysis', 'GitHub Diff']
    },
  ];

  const handleCardClick = (tool) => {
    if(!user){
      showError("Login required")
      navigate("/login");
      return;
    }if(!repoUrl) {
      navigate("/github-connect");
    } else {
      navigate(tool.goTo);
    }
  };

  const handleDisconnect = async() => {
    await resetSession();
    showSuccess("Session Terminated.");
    navigate('/');
  }

  return (
    <div className="flex h-screen bg-[#0A0D14] overflow-hidden">
      
      <Navbar />
      
      <div className="flex flex-col flex-1 w-full overflow-hidden relative">
        
        <header className="sticky top-0 z-30 bg-[#0A0D14]/90 backdrop-blur-md border-b md:border-none border-gray-800/60 pl-16 pr-4 py-3 md:px-8 md:py-6 lg:px-12 w-full flex justify-between items-center transition-all">
          
          <div className="flex group items-center gap-2.5 cursor-default bg-gray-900/40 border border-gray-800/60 px-1.5 py-1 sm:px-3 sm:py-2 rounded-full transition-all duration-300 shadow-sm max-w-[110px]  sm:max-w-[150px] lg:max-w-xs">
              <div className={`w-6 h-6 sm:w-8 sm:h-8 shrink-0 rounded-full flex items-center justify-center ring-2 ring-[#0A0D14] transition-all duration-300 ${
                isApiConnected
                  ? 'bg-green-500/10 text-green-400 group-hover:shadow-[0_0_10px_rgba(74,222,128,0.2)]'
                  : 'bg-orange-500/10 text-orange-400'
                }`}>
                {/* ai-icon */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div className="flex flex-col justify-center overflow-hidden pr-1">
               <span className="text-[11px] sm:text-sm font-semibold text-gray-200 truncate leading-tight">
                  {currentModel}
                </span>
                <span className={`text-[8px] sm:text-[10px] font-medium truncate uppercase tracking-wider leading-tight ${
                  isApiConnected
                    ? 'text-green-500/80'
                    : 'text-orange-500/80 animate-pulse'
                  }`}>
                  {isApiConnected ? 'API Ready' : 'Needs Config'}
                </span>
              </div>
            </div>

          <div className="flex items-center gap-1 sm:gap-4 ml-auto">
            
          {/*repo pill */}
            <div className="flex group items-center gap-1 sm:gap-2.5 cursor-pointer bg-gray-900/40 hover:bg-gray-800/60 border border-gray-800/60 hover:border-gray-700/80 px-1.5 py-1 sm:px-3 sm:py-2 rounded-full transition-all duration-300 max-w-[110px] sm:max-w-[150px] lg:max-w-xs shadow-sm hover:shadow-md hover:shadow-black/20 active:scale-[0.98]">
              <div className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 rounded-full bg-blue-500/40 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex flex-col justify-center overflow-hidden pr-1">
                <span className="text-[11px] sm:text-sm font-semibold text-gray-200 truncate leading-tight group-hover:text-white transition-colors">
                  {repoName}
                </span>
                <span className="text-[8px] sm:text-[10px] text-blue-500/80 font-medium truncate uppercase tracking-wider leading-tight group-hover:text-blue-400 transition-colors">
                  {repoUrl ? 'Active Repo' : 'Disconnected'}
                </span>
              </div>
            </div>

            {repoUrl && (
              <button 
                  onClick={handleDisconnect}
                  className="text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 font-medium text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 rounded-full transition-all border border-red-400/20"
                >
                Disconnect
              </button>
            )}

            <button 
              className="relative p-2 md:p-2.5 text-gray-400 hover:text-gray-100 bg-gray-900/30 hover:bg-gray-800/80 border border-transparent hover:border-gray-700/50 rounded-full transition-all duration-200 active:scale-95 shrink-0" 
              title="Notifications"
            >
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0A0D14]"></span>
              <svg className="w-5 h-5 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            <div className="w-px h-6 bg-gray-800/60 hidden sm:block"></div>
            
          </div>
        </header>

        <main className="flex-1 overflow-y-auto text-gray-300 font-sans p-4 md:p-8 lg:p-12 w-full">
          <div className="max-w-7xl mx-auto">
            
            <div className="mb-8 md:mb-12 mt-2 md:mt-0">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">Developer Command Center</h1>
              <p className="text-base md:text-lg text-gray-500">Select a tool to analyze, visualize, or document your codebase.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
              {tools.map((tool) => (
                <button 
                  key={tool.id}
                  onClick={() => handleCardClick(tool)}
                  className={`group relative flex flex-col text-left bg-[#11151D] border border-gray-800/60 rounded-2xl p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 ${tool.borderHover}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.bgGradient} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500 pointer-events-none`}></div>
                  
                  <div className="relative z-10 flex justify-between items-start mb-4 w-full">
                    <div className="p-3 bg-gray-900/80 border border-gray-800 rounded-xl shadow-sm">
                      {tool.icon}
                    </div>
                    {tool.badge && (
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                        tool.badge === 'Popular' 
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                          : tool.badge === 'Beta' 
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          : tool.badge == 'Essential'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : tool.badge == '🔥 High Impact'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : tool.badge == 'Time Saver'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-pink-500/10 text-pink-400 border-pink-500/20'
                      }`}>
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="relative z-10 text-lg md:text-xl font-bold text-gray-100 mb-2 group-hover:text-white transition-colors">
                    {tool.title}
                  </h3>
                  
                  <p className="relative z-10 text-sm text-gray-400 leading-relaxed mb-6 flex-1">
                    {tool.description}
                  </p>

                  <div className="relative z-10 flex items-center justify-between w-full mt-auto pt-4 border-t border-gray-800/50">
                    <div className="flex flex-wrap gap-2">
                      {tool.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 text-[10px] md:text-xs font-medium text-gray-500 bg-gray-900 rounded-md border border-gray-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-gray-600 group-hover:text-white transition-colors transform group-hover:translate-x-1 duration-300 shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>

          </div>
        </main>
      </div>


    </div>
  );
};

export default Dashboard;




