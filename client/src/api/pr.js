import api from "../utils/axios";

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