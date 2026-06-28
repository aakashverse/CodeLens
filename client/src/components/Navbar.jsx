import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router'; 
import { useAuth } from '../hooks/useAuth';
import useToast from '../hooks/useToast';

const Navbar = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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


  const getLinkStyles = (path) => {
    const isActive = location.pathname === path;
    return `
      group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium
      ${isActive 
        ? 'bg-gradient-to-r from-blue-500/10 to-transparent text-blue-400' 
        : 'text-gray-400 hover:bg-gray-800/40 hover:text-gray-200'}
    `;
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-3 left-4 z-40 p-2 bg-[#0E1117] border border-gray-800 rounded-lg text-gray-400 hover:text-white shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsOpen(false)} />
      )}

      <aside className={`
        fixed md:relative inset-y-0 left-0 z-50 h-screen bg-[#0E1117] flex flex-col border-r border-gray-800 shadow-2xl shrink-0 
        transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        ${isCollapsed ? "w-20" : "w-64"}
      `}>
        
      <div className="h-16 px-4 border-b border-gray-800 flex items-center justify-between shrink-0 overflow-hidden">
        <div className="flex items-center gap-3 w-full">

          <div className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0 shadow-lg shadow-black/40">

            <svg className="w-10 h-10 text-gray-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

              <circle cx="10.5" cy="10.5" r="8" stroke="currentColor" strokeWidth="1.5" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

              <g className="text-blue-500" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 8L4 10.5L7 13" />
                <path d="M9.5 14.5L11.5 6.5" />
                <path d="M14 8L17 10.5L14 13" />
              </g>

            </svg>
          </div>

          {!isCollapsed && (
            <h2 className="text-lg font-bold text-white tracking-wide whitespace-nowrap animate-in fade-in duration-300">
              Code<span className="text-blue-500">Lens</span>
            </h2>
          )}
        </div>
        
        <button onClick={() => setIsOpen(false)} className="md:hidden p-1.5 text-gray-500 hover:bg-gray-800 rounded-md">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 flex flex-col gap-6 scrollbar-hide">
          
          <nav className="space-y-6 px-3">
            <div>
              {!isCollapsed && <p className="px-3 text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-2">Platform</p>}
              <div className="space-y-1">
                <button onClick={() => handleNav('/dashboard')} className={getLinkStyles('/dashboard')} title={isCollapsed ? "Dashboard" : ""}>
                  {location.pathname === '/dashboard' && !isCollapsed && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>}
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                  {!isCollapsed && <span className="whitespace-nowrap">Dashboard</span>}
                </button>
              </div>
            </div>

            <div>
              {!isCollapsed && <p className="px-3 text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-2">Resources</p>}
              <div className="space-y-1">
                <button onClick={() => handleNav('/docs')} className={getLinkStyles('/docs')} title={isCollapsed ? "Documentation" : ""}>
                  {location.pathname === '/docs' && !isCollapsed && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>}
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  {!isCollapsed && <span className="whitespace-nowrap">Documentation</span>}
                </button>
              </div>
            </div>
          </nav>
        </div>

        <div className="p-3 border-t border-gray-800 flex flex-col gap-2">
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex w-full items-center justify-center p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
          </button>

          {!user ? (
            <button onClick={() => handleNav('/login')} className={`w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium transition-colors ${isCollapsed ? '' : 'px-4'}`}>
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
              {!isCollapsed && <span className="whitespace-nowrap">Sign In</span>}
            </button>
          ) : (
            <div className={`flex items-center ${isCollapsed ? 'justify-center flex-col gap-3' : 'justify-between'} p-1.5 rounded-lg border border-gray-800 bg-black/20`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {user?.username ? user.username.substring(0, 2).toUpperCase() : '∞'}
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-200">{user.username}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Free Plan</span>
                  </div>
                )}
              </div>
              <button onClick={handleLogoutClick} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors shrink-0" title="Log out">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;