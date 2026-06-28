import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from 'react-router';
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider } from './context/auth.context';
import { AiSessionProvider } from "./context/ai-session.context.jsx";
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
      <AiSessionProvider>
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
          <Route path='/ai-session' element={<Protected><AiSession/></Protected>}/>
          <Route path='/readme' element={<Protected><AutoReadme/></Protected>}/>
          <Route path='/architecture' element={<Protected><ViewArchitecture/></Protected>}/>
          <Route path="/analyze-code" element={<Protected><Analyzer/></Protected>}/>
          <Route path='/analyze-pr' element={<Protected><PRAnalyzer/></Protected>}/>

          
        </Routes>
        
        <ToastContainer position="top-right" pauseOnHover="false"/>
      </BrowserRouter>
      </ReadmeProvider>
      </PrAnalyzerProvider>
      </AnalyzerProvider>
      </ArchitectureProvider>
      </AiSessionProvider>
    </AuthProvider>
  )
}

export default App;
