import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const Register = () => {

  const {loading, handleRegister} = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState('student')

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log('Signup submitted:', {username,email, password, role});
    await handleRegister({username, email, password, role});
    navigate("/");
  };

  if(loading){
    return (<main><h2>Loading....</h2></main>);
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white">
      <div className="text-center mt-10 mb-9">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create your account</h2>
        <p className="text-gray-500">Start analyzing your codebase for free.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">Username</label>
          <input 
            id="username" name="username" type="text" required
            value={username} onChange={ (e) => {setUsername(e.target.value)}}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
            placeholder="johndoe" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email Address</label>
          <input 
            id="email" name="email" type="email" required
            value={email} onChange={(e) => {setEmail(e.target.value)}}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
            placeholder="you@company.com" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
          <input 
            id="password" name="password" type="password" required
            value={password} onChange={(e) => {setPassword(e.target.value)}}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
            placeholder="••••••••" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
          <div className="grid grid-cols-2 gap-4">
            
            <label className={`cursor-pointer border rounded-lg p-4 transition-all ${role === 'professional' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-300 hover:border-gray-400 bg-white'}`}>
              <input 
                type="radio" name="role" value="professional"
                checked={role === 'professional'} onChange={(e) => {setRole(e.target.value)}}
                className="sr-only"
              />
              <div className="flex flex-col items-center text-center">
                <svg className={`w-6 h-6 mb-2 ${role === 'professional' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span className={`text-sm font-semibold ${role === 'professional' ? 'text-blue-900' : 'text-gray-700'}`}>Working Pro</span>
              </div>
            </label>

            <label className={`cursor-pointer border rounded-lg p-4 transition-all ${role === 'student' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-300 hover:border-gray-400 bg-white'}`}>
              <input 
                type="radio" name="role" value="student"
                checked={role === 'student'} onChange={(e) => {setRole(e.target.value)}}
                className="sr-only"
              />
              <div className="flex flex-col items-center text-center">
                <svg className={`w-6 h-6 mb-2 ${role === 'student' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
                <span className={`text-sm font-semibold ${role === 'student' ? 'text-blue-900' : 'text-gray-700'}`}>Student</span>
              </div>
            </label>

          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mt-6">
          Create Account
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Already have an account? 
        <button className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
          {<Link to={"/login"}> Login</Link>}
        </button>
      </p>
    </div>
  );
};

export default Register;