import axios from 'axios';

const apiClient = axios.create({
    // 34.28.18.68
    // baseURL: 'http://35.192.40.83:5001',
    baseURL: 'http://34.28.18.68:5001',
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

// Traffic

export const uploadTrafficFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await apiClient.post('/Traffic/upload_and_process/', formData);
        return response.data;
    } catch (error) {
        console.error('Upload error: ', error);
        throw error;
    }
};

export const gettraffic = async () =>{
    try {
        const response = await apiClient.get('/traffic');
        return response.data;        
    }catch (error){
        console.error('Error fetching traffic:', error);
        throw error;
    }
};

export const gettrafficById = async (id: any) =>{
    try {
        const response = await apiClient.get(`/traffic/${id}`);
        return response.data;        
    }catch (error){
        console.error('Error fetching traffic:', error);
        throw error;
    }
};

export const deletetrafficById = async (id: any) =>{
    try{
        const response = await apiClient.delete(`Traffic/delete/${id}`)
        return response.data;
    }catch (error){
        console.error('Error fetching traffic:', error);
        throw error;
    }
}

// Log

export const uploadLogFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await apiClient.post('/log/upload_and_process/', formData);
        return response.data;
    } catch (error) {
        console.error('Upload error: ', error);
        throw error;
    }
};

export const getlogByID = async (id: any) =>{
    try {
        const response = await apiClient.get(`/log/${id}`);
        return response.data;        
    }catch (error){
        console.error('Error fetching traffic:', error);
        throw error;
    }
};

export const deletelogById = async (id: any) =>{
    try{
        const response = await apiClient.delete(`Log/delete/${id}`)
        return response.data;
    }catch (error){
        console.error('Error fetching traffic:', error);
        throw error;
    }
};

export const getlog = async () =>{
    try {
        const response = await apiClient.get('/log');
        return response.data;        
    }catch (error){
        console.error('Error fetching traffic:', error);
        throw error;
    }
};
