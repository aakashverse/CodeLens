import api from "../utils/axios";

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
      console.error("Chat API failed:");
      console.error("Status:", err.response?.status);
      console.error("Response:", err.response?.data);
      console.error("Message:", err.message);
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
