import { useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const context = useContext(AuthContext);
  const {user} = context;

  const navigate = useNavigate();

  const tools = [
    {
      id: 'chat-codebase',
      title: 'CodeLens AI Session',
      goTo: '/ai-session',
      description: 'Chat with your repository. Instantly trace data flows and understand complex logic using GenAI.',
      icon: (
        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
      ),
      bgGradient: 'from-blue-500/10 to-indigo-500/10',
      borderHover: 'hover:border-blue-500/50',
      badge: 'Popular',
      tags: ['MERN', 'GenAI']
    },
    {
      id: 'auto-readme',
      title: 'Auto-README Generator',
      goTo: '/gen-readme',
      description: 'Automatically scan your tech stack and generate comprehensive, beautifully formatted documentation.',
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      ),
      bgGradient: 'from-emerald-500/10 to-teal-500/10',
      borderHover: 'hover:border-emerald-500/50',
      tags: ['Markdown', 'AST']
    },
    {
      id: 'architecture',
      title: 'Architecture Viewer',
      goTo: '/view-architecture',
      description: 'Visualize your entire codebase as an interactive node graph. See how components and routes connect.',
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
      ),
      bgGradient: 'from-purple-500/10 to-fuchsia-500/10',
      borderHover: 'hover:border-purple-500/50',
      badge: 'Beta',
      tags: ['React', 'Node.js']
    },
    {
      id: 'smell-detector',
      title: 'Code Smell Detector',
      goTo: '/ai-session',
      description: 'Scan your files for anti-patterns, redundant queries, and performance bottlenecks before you deploy.',
      icon: (
        <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      ),
      bgGradient: 'from-rose-500/10 to-orange-500/10',
      borderHover: 'hover:border-rose-500/50',
      tags: ['Performance', 'Security']
    }
  ];

  return (
    <div className="flex h-screen bg-[#0A0D14] overflow-hidden">
      
      {/* left sidebar */}
      <Navbar/>


      <main className="flex-1 overflow-y-auto text-gray-300 font-sans p-8 md:p-12 relative">
        
      
        <header className="flex justify-between items-center mb-16 max-w-6xl mx-auto">
          {/* Page Title (Optional: You removed the logo since it's in the sidebar, which is cleaner) */}
          <h2 className="text-xl font-semibold text-white tracking-wide">Workspace</h2>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:text-white transition-colors" title="Notifications">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>
            <div className="flex items-center gap-2 cursor-pointer bg-gray-900/50 border border-gray-800 px-3 py-1.5 rounded-full hover:bg-gray-800 transition-colors">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold">
                {user ? user.username.substring(0, 2).toUpperCase() : 'GS'}
              </div>
              <span className="text-sm font-medium text-gray-300">
                {user ? `${user.username}'s Workspace` : 'Guest Workspace'}
              </span>
            </div>
          </div>
        </header>

        
        <div className="max-w-6xl mx-auto">
          
          
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Developer Command Center</h1>
            <p className="text-lg text-gray-500">Select a tool to analyze, visualize, or document your codebase.</p>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {tools.map((tool) => (
              <button 
                key={tool.id}
                onClick={() => navigate(tool.goTo)}
                className={`group relative flex flex-col text-left bg-[#11151D] border border-gray-800/60 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 ${tool.borderHover}`}
              >
                
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.bgGradient} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500 pointer-events-none`}></div>
                
                <div className="relative z-10 flex justify-between items-start mb-4">
                  <div className="p-3 bg-gray-900/80 border border-gray-800 rounded-xl shadow-sm">
                    {tool.icon}
                  </div>
                  {tool.badge && (
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                      tool.badge === 'Popular' 
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                        : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    }`}>
                      {tool.badge}
                    </span>
                  )}
                </div>

                <h3 className="relative z-10 text-xl font-bold text-gray-100 mb-2 group-hover:text-white transition-colors">
                  {tool.title}
                </h3>
                
                <p className="relative z-10 text-sm text-gray-400 leading-relaxed mb-6 flex-1">
                  {tool.description}
                </p>

                {/* Tags & Action Arrow */}
                <div className="relative z-10 flex items-center justify-between w-full mt-auto pt-4 border-t border-gray-800/50">
                  <div className="flex gap-2">
                    {tool.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-xs font-medium text-gray-500 bg-gray-900 rounded-md border border-gray-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-gray-600 group-hover:text-white transition-colors transform group-hover:translate-x-1 duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </div>
                </div>
              </button>
            ))}
          </div>

         
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-200">Recent Workspaces</h2>
              <button className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors">View All</button>
            </div>
            
            <div className="bg-[#11151D] border border-gray-800/60 rounded-xl overflow-hidden">
              {/* Repo Item */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 group-hover:text-blue-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">markme-attendance</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Updated 2 hours ago • Local Directory</p>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 px-3 py-1.5 text-xs font-semibold text-gray-300 bg-gray-800 rounded-md hover:bg-gray-700 transition-all">
                  Open Workspace
                </button>
              </div>
              
          
              <div className="flex items-center gap-3 p-4 hover:bg-gray-800/30 transition-colors cursor-pointer text-gray-400 hover:text-white group">
                <div className="w-10 h-10 rounded-lg border border-dashed border-gray-700 flex items-center justify-center group-hover:border-gray-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </div>
                <span className="text-sm font-medium">Connect new repository</span>
              </div>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
};

export default Dashboard;