import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import Navbar from "../components/Navbar";

const Home = () => {
    const {user} = useAuth();
    const navigate = useNavigate();

    const handleSignupClick = () => {
        navigate('/signup');
    }

    const handleLoginClick = () => {
        navigate('/login');
    }


  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* left nvbar */}
      <Navbar/>

      <main className="flex-1 relative flex flex-col items-center justify-center p-8 lg:p-24 z-10 bg-white">
        
        <div 
          className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}
        ></div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

        <div className="max-w-3xl text-center mt-5 z-10 flex flex-col items-center">

          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-[1.15] tracking-tight">
            Stop guessing.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Understand Your Codebase.
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl">
            The developer intelligence platform that instantly visualizes architecture, traces complex data flows, and explains legacy logic in seconds.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
          {!user ? (
            <>
              <button
                onClick={handleSignupClick}
                className="px-8 py-3.5 bg-gray-900 hover:bg-black text-white font-semibold text-sm rounded-lg shadow-xl shadow-gray-900/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                Sign Up
              </button>
          
              <button
                onClick={handleLoginClick}
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-800 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 flex items-center justify-center"
              >
                Log In
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/github-connect")}
              className="px-8 py-3.5 bg-gray-900 hover:bg-black text-white font-semibold text-sm rounded-lg shadow-xl shadow-gray-900/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              Go to Workspace
            </button>
          )}
          </div>
          
          <p className="mt-6 text-sm text-gray-500">
            Free forever for open-source projects. No credit card required.
          </p>

        </div>
      </main>
    </div>
  );
};

export default Home;