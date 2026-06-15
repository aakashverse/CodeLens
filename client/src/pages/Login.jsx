import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const {loading, handleLogin} = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log('Login submitted:', {email});
    await handleLogin({email, password});
    navigate('/');
  };

  if(loading){
    return (<main><h1>Loading..</h1></main>)
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white">
      <div className="text-center mt-20 mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome back</h2>
        <p className="text-gray-500">Log in to your CodeLens dashboard.</p>
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
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
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <a href="#forgot" className="text-sm font-medium text-blue-600 hover:text-blue-500">Forgot password?</a>
          </div>
          <input 
            id="password" name="password" type="password" required
            value={password} onChange={(e) => {setPassword(e.target.value)}}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
            placeholder="••••••••" 
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mt-2">
          Log In
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
          {<Link to={"/signup"}> SignUp</Link>}
        </button>
      </p>
    </div>
  );
};

export default Login;