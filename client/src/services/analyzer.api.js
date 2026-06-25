import axios from "axios";

    const api = axios.create({
        baseURL: "http://localhost:5000",
        withCredentials: true
    });

    export async function AnalyzeCode(githubUrl){
        try{
            const response = await api.post("/api/analyze/code", {
                githubUrl
            });
            console.log("Code Analysis: ", response.data);
            
            return response.data;
        } catch(err){
            console.log("Analyzer error: ", err);
            throw err;
        }
    }