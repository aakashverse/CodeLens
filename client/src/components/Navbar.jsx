import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
    const {user, handleLogout} = useAuth();
    const navigate = useNavigate();

    const handleClick = () => {
      if(!user){
        navigate('/login');
      }
    }

    const handlelogout = async() => {
      await handleLogout();
      navigate("/");
    }

  return (
    <aside className="w-64 h-screen bg-[#0E1117] text-gray-400 flex flex-col border-r border-gray-800 shadow-2xl z-20 shrink-0">
      
      {/* Logo & Name */}
      <div className="p-6 border-b border-gray-800/50">
        <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
          <svg className="w-8 h-8 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M22 22l-6-6M10 16a6 6 0 100-12 6 6 0 000 12z" />
            <text x="10" y="10.5" textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="currentColor" style={{userSelect: 'none'}}>&lt;/&gt;</text>
          </svg>
          Code<span className="text-blue-500">Lens</span>
        </h2>
      </div>
      
      {/* Navigation Options */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-hide">
        
        {/* Group 1: Platform */}
        <div>
          <p className="px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Platform</p>
          <div className="space-y-1">
            <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800/50 hover:text-gray-200 transition-colors text-sm font-medium text-left">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              Workspace
            </button>
            <button onClick={() => navigate('/view-architecture')} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800/50 hover:text-gray-200 transition-colors text-sm font-medium text-left">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              Architecture Viewer
            </button>
            <button onClick={() => navigate('/ai-session')} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800/50 hover:text-gray-200 transition-colors text-sm font-medium text-left">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              AI Codebase RAG
            </button>
          </div>
        </div>

        {/* Group 2: Resources */}
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

      {/* User Profile */}
      <div className="p-4 border-t border-gray-800/50">
  {!user ? (
    <button 
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm font-medium transition-colors"
    >
      Sign in to sync data
       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
    </button>
  ) : (
    <div className="w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-800/30 transition-colors group">
      
      {/* Profile Info */}
      <div className="flex items-center gap-3 overflow-hidden cursor-default">
        <div className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 font-bold text-xs shrink-0 group-hover:border-gray-500 transition-colors">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-medium text-gray-300 truncate">{user.username}</span>
          <span className="text-xs text-gray-500 truncate">Pro Workspace</span>
        </div>
      </div>
      
      {/* lgout btn */}
      <button 
        onClick={handlelogout} 
        className="p-2 text-gray-500 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
        title="Log out"
      >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
      </button>

      </div>
      )}
    </div>
  </aside>
  );
};

export default Navbar;