import axios from "axios";

  const api = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      withCredentials: true
  });

export async function AnalyzePR(prUrl) {
    try {
        const response = await api.post("/api/pr/analyze", {
            prUrl
        });

        console.log("AnalyzePR: ", response.data);
        return response.data;

    } catch (error) {
        console.log("PR Analysis Error: ", error);
        throw error;
    }
}