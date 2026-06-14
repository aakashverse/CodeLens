import { useContext } from "react";
import { register, login, logout } from "../services/auth.api";
import { AuthContext } from "../context/auth.context";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const {user, setUser, loading, setLoading} = context;

    const handleLogin = async ({email, password}) => {
        try{
            setLoading(true);
            const data = await login({email, password});
            setUser(data?.user);
        } catch(err){
            console.log(err);
        } finally{
            setLoading(false);
        }
    }

    const handleRegister = async ({username, email, password, role}) => {
        try{
            setLoading(true);
            const data = await register({username, email, password, role});
            setUser(data?.user);
        } catch(err){
            console.log(err);
        } finally{
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        try{
            setLoading(true);
            const data = await logout();
            setUser(null);
        } catch(err){
            console.log(err);
        } finally{
            setLoading(false);
        }
    }

    return {user, loading, handleRegister, handleLogin, handleLogout};
    
}
