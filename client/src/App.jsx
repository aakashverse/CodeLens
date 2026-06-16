import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from 'react-router';
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider } from './context/auth.context';
import { RagProvider } from "./context/rag.context";
import Dashboard from "./pages/Dashboard";
import GithubConnectForm from "./components/GithubConnectForm";
import AiSession from "./pages/AiSession";

const App = () => {
  return (
    <AuthProvider>
      <RagProvider>
      <BrowserRouter>
    
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/signup' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/github-connect' element={<GithubConnectForm/>}/>
          <Route path='/ai-session' element={<AiSession/>}/>
        </Routes>
        
      </BrowserRouter>
      </RagProvider>
    </AuthProvider>
  )
}

export default App;
