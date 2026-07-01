import { useContext, useEffect } from "react";
import { register, login, logout, getMe } from "../api/auth.api";
import { AuthContext } from "../context/auth.context";
import { AiSessionContext } from "../context/ai-session.context";

export const useAuth = () => {
    const {user, setUser, loading, setLoading} = useContext(AuthContext);
    const {setSelectedModel } = useContext(AiSessionContext);

    const syncAiPreferences = (userData) => {
        if (userData?.aiModel) {
            setSelectedModel(userData.aiModel);
        }
    };

    const handleLogin = async ({email, password}) => {
        try{
            setLoading(true);
            const data = await login({email, password});
            setUser(data?.user);
            syncAiPreferences(data?.user);
        } catch(err){
            console.error("Login failed:", err);
            throw err;
        } finally{
            setLoading(false);
        }
    }

    const handleRegister = async ({username, email, password, role}) => {
        try{
            setLoading(true);
            const data = await register({username, email, password, role});
            setUser(data?.user);
            syncAiPreferences(data?.user);
        } catch(err){
            console.error("Registration failed:", err);
            throw err;
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

    const refreshUser = async () => {
        try {
            const data = await getMe();
            setUser(data.user);
            syncAiPreferences(data.user);
            return data.user;
        } catch(err) {
            console.error("Failed to refresh user:", err);
        }
    };

    useEffect(() => {
        const getUser = async () => {
            try{
                const data = await getMe();
                setUser(data.user);
                syncAiPreferences(data?.user); 
            } catch(err) {}
            finally {
                setLoading(false);
            }
        };
       
        getUser();
    }, [])
    

    return {user, loading, handleRegister, handleLogin, handleLogout, refreshUser};
    
}
