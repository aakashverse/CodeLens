import axios from "axios";

  const api = axios.create({
      baseURL: "http://localhost:5000",
      withCredentials: true
  });

  export async function connectRepo(githubUrl){
    try{
      const response = await api.post('/api/repo/connect', {
        githubUrl
      })

      return response.data;
    } catch(err){
      console.log(err);
      throw err;
    }
  }

  export async function sendChatMessage(question, githubUrl){
    try{
      const response = await api.post('/api/repo/chat',{
        question, githubUrl
      })
    
      return response.data;
    } catch(err){
      console.log(err);
      throw err;
    }
  }

  export async function checkRepoStatus(githubUrl){
    
    try{
      const response = await api.get('/api/repo/check-status', {
          params: {githubUrl}
      }
    );
    
      return response.data;
    } catch(err){
      console.log(err);
      throw err;
    }
  }
