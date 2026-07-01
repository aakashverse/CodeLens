import api from "../utils/axios";

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
