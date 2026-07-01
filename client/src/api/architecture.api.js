import api from "../utils/axios";

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