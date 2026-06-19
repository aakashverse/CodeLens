import axios from "axios";

    const api = axios.create({
        baseURL: "http://localhost:5000",
        withCredentials: true
    });

    export async function generateArchitecture(){
        try{
            const response = await api.get("/api/visualize/architecture");
            console.log("Gen Arch: ", response.data);
            return response.data;
        } catch(err){
            console.log("Arch error: ", err);
            throw err;
        }
    }