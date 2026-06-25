import axios from "axios";

  const api = axios.create({
      baseURL: "http://localhost:5000",
      withCredentials: true
  });


    export async function generateReadme(githubUrl){
        try{
            const response = await api.post('/api/gen/readme', {
                githubUrl
            });

            return response.data;

        } catch(err){
            console.log(err);
            throw err;
        }
    }
