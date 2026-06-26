import { useState } from 'react';
import { useNavigate } from 'react-router'; // Note: often this is 'react-router-dom' in web apps
import { useAuth } from '../hooks/useAuth';
import useToast from '../hooks/useToast';

const Navbar = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  
  // State for mobile drawer
  const [isOpen, setIsOpen] = useState(false);

  // Auto-close drawer on navigation (Mobile)
  const handleNav = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogoutClick = async () => {
    await handleLogout();
    showSuccess("Logout successful");
    setIsOpen(false);
    navigate("/");
  };

  return (
    <>
  
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-3 left-4 z-40 p-2 bg-[#0E1117] border border-gray-800 rounded-lg text-gray-400 hover:text-white shadow-lg"
        aria-label="Open Menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed md:relative inset-y-0 left-0 z-50 w-64 h-screen bg-[#0E1117] text-gray-400 flex flex-col border-r border-gray-800 shadow-2xl shrink-0 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      `}>
        
        <div className="h-16 p-6 border-b border-gray-800 flex items-center justify-between shrink-0 bg-[#0E1117]">
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <svg className="w-7 h-7 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M22 22l-6-6M10 16a6 6 0 100-12 6 6 0 000 12z" />
              <text x="10" y="10.5" textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="currentColor" style={{userSelect: 'none'}}>&lt;/&gt;</text>
            </svg>
            Code<span className="text-blue-500">Lens</span>
          </h2>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1.5 text-gray-500 hover:bg-gray-800 rounded-md transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-hide">
          {/* Platform Group */}
          <div>
            <p className="px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Platform</p>
            <div className="space-y-1">
              <button onClick={() => handleNav('/dashboard')} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800/50 hover:text-gray-200 transition-colors text-sm font-medium text-left">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                Dev Tools
              </button>
              <button onClick={() => handleNav('/ai-session')} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800/50 hover:text-gray-200 transition-colors text-sm font-medium text-left">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                AI Codebase RAG
              </button>
              <button onClick={() => handleNav('/architecture')} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800/50 hover:text-gray-200 transition-colors text-sm font-medium text-left">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                Architecture Viewer
              </button>
              
            </div>
          </div>

          <div>
            <p className="px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Resources</p>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800/50 hover:text-gray-200 transition-colors text-sm font-medium text-left">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                Documentation
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800/50 hover:text-gray-200 transition-colors text-sm font-medium text-left">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                API Reference
              </button>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-800 bg-[#0E1117] shrink-0">
          {!user ? (
            <button 
              onClick={() => handleNav('/login')}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm font-medium transition-colors"
            >
              Sign in to sync data
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          ) : (
            <div className="w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-800/50 transition-colors group">
              <div className="group flex items-center gap-2.5 cursor-pointer bg-gray-900/40 hover:bg-gray-800/60 border border-gray-800/60 hover:border-gray-700/80 px-2 py-1.5 md:px-3 md:py-2 rounded-full transition-all duration-300 min-w-0 shadow-sm hover:shadow-md hover:shadow-black/20 active:scale-[0.98]">
              <div className="w-7 h-7 md:w-8 md:h-8 shrink-0 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white text-[10px] md:text-xs font-bold ring-2 ring-[#0A0D14] group-hover:ring-gray-600 transition-all duration-300 shadow-inner">
                {user?.username ? user.username.substring(0, 2).toUpperCase() : '∞'}
              </div>
              <div className="flex flex-col justify-center overflow-hidden pr-1 hidden sm:flex">
                <span className="text-[13px] md:text-sm font-semibold text-gray-200 truncate leading-tight group-hover:text-white transition-colors">
                  {user ? user.username : '∞'}
                </span>
                <span className="text-[9px] md:text-[10px] text-gray-500 font-medium truncate uppercase tracking-wider leading-tight group-hover:text-gray-400 transition-colors">
                  {user ? 'Workspace' : 'Read-only'}
                </span>
              </div>
            </div>
              <button 
                onClick={handleLogoutClick} 
                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                title="Log out"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;