import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from 'react-router';
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider } from './context/auth.context';
import Workspace from "./pages/Workspace";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
    
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/signup' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
        </Routes>
        
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
