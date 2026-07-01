import api from "../utils/axios";


    export async function SendApiKey(apiKey, aiModel){
        try{
            const response = await api.post('/api/user/settings', {
                apiKey, aiModel
            });

            return response.data;
        } catch(err){
            console.log(err);
            throw err;
        }
    }

    export async function GetUserSettings() {
        try {
            const response = await api.get('/api/user/settings');
            return response.data;
        } catch (err) {
            console.error("Error in GetUserSettings:", err);
            throw err;
        }
    }
