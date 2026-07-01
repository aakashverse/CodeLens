import axios from "axios";
// import.meta.env.VITE_API_URL

    const api = axios.create({
      baseURL: 'http://localhost:5000',
      withCredentials: true
    });

    export default api;