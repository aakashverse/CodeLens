import axios from "axios";

    const api = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        withCredentials: true
    });

    export async function generateArchitecture(githubUrl){
        try{
            const response = await api.post("/api/visualize/architecture", {
                githubUrl
            });
            
            console.log("Gen Arch: ", response.data);
            return response.data;
        } catch(err){
            console.log("Arch error: ", err);
            throw err;
        }
    }