import axios from "axios";

  const api = axios.create({
      baseURL: "http://localhost:5000",
      withCredentials: true
  });


    export async function generateReadme(){
        try{
            const response = await api.get('/api/gen/readme');

            return response.data;

        } catch(err){
            console.log(err);
            throw err;
        }
    }
