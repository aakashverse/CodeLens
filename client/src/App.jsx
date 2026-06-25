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
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/github-connect' element={<GithubConnectForm/>}/>
          <Route path='/ai-session' element={<AiSession/>}/>
          <Route path='/readme' element={<AutoReadme/>}/>
          <Route path='/architecture' element={<ViewArchitecture/>}/>
          <Route path="/analyze-code" element={<Analyzer/>}/>
          <Route path='/analyze-pr' element={<PRAnalyzer/>}/>
          
        </Routes>
        
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
