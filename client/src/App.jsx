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
import ViewArchitecture from "./pages/Architecture";
import { ArchitectureProvider } from "./context/architecture.context";
import Analyzer from "./pages/Analyzer";
import { AnalyzerProvider } from "./context/analyzer.context";
import PRAnalyzer from "./pages/PrAnalyzer.jsx";
import { PrAnalyzerProvider } from "./context/pr.context.jsx";
import Protected from "./components/Protected.jsx";
import {ToastContainer} from "react-toastify"
import { RequireRepo } from "./components/RequireRepo.jsx";

const App = () => {
  return (
    <AuthProvider>
      <WorkspaceProvider>
      <ArchitectureProvider>
      <AnalyzerProvider>
      <PrAnalyzerProvider>
      <ReadmeProvider>
      <BrowserRouter>
    
        <Routes>

          <Route path='/' element={<Home/>}/>
          <Route path='/signup' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/dashboard' element={<Protected><Dashboard/></Protected>}/>
          <Route path='/github-connect' element={<Protected><GithubConnectForm/></Protected>}/>
          <Route path='/ai-session' element={<Protected><RequireRepo><AiSession/></RequireRepo></Protected>}/>
          <Route path='/readme' element={<Protected><RequireRepo><AutoReadme/></RequireRepo></Protected>}/>
          <Route path='/architecture' element={<Protected><RequireRepo><ViewArchitecture/></RequireRepo></Protected>}/>
          <Route path="/analyze-code" element={<Protected><RequireRepo><Analyzer/></RequireRepo></Protected>}/>
          <Route path='/analyze-pr' element={<Protected><RequireRepo><PRAnalyzer/></RequireRepo></Protected>}/>

          
        </Routes>
        
        <ToastContainer position="top-right" />
      </BrowserRouter>
      </ReadmeProvider>
      </PrAnalyzerProvider>
      </AnalyzerProvider>
      </ArchitectureProvider>
      </WorkspaceProvider>
    </AuthProvider>
  )
}

export default App;
