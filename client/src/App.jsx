import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from 'react-router';
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider } from './context/auth.context';
import { WorkspaceProvider } from "./context/workspace.context";
import Dashboard from "./pages/Dashboard";
import GithubConnectForm from "./components/GithubConnectForm";
import AiSession from "./pages/AiSession";
import AutoReadme from "./pages/AutoReadme";
import {ReadmeProvider} from "./context/readme.context";

const App = () => {
  return (
    <AuthProvider>
      <WorkspaceProvider>
      <ReadmeProvider>
      <BrowserRouter>
    
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/signup' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/github-connect' element={<GithubConnectForm/>}/>
          <Route path='/ai-session' element={<AiSession/>}/>
          <Route path='/gen-readme' element={<AutoReadme/>}/>
        </Routes>
        
      </BrowserRouter>
      </ReadmeProvider>
      </WorkspaceProvider>
    </AuthProvider>
  )
}

export default App;
