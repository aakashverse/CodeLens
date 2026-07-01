import api from "../utils/axios";

    export async function AnalyzeCode(githubUrl){
        try{
            const response = await api.post("/api/analyze/code", {
                githubUrl
            });
            
            return response.data;
        } catch(err){
            console.log("Analyzer error: ", err);
            throw err;
        }
    }