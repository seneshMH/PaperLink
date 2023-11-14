import { axiosInstance } from "./axios.instance";

//find conversation if not create one
export const findOrCreateConversation = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/conversations/find-or-create-conversation', payload);
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//update conversation
export const updateConversation = async (payload) => {
    try {
        const response = await axiosInstance.put('/api/conversations/update-conversation', payload);
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//get single conversation
export const getSingleConversation = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/conversations/get-conversation/${id}`);
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//get all conversations
export const getAllConversations = async (filters) => {
    try {
        const response = await axiosInstance.post('/api/conversations/get-conversations', filters);
        return response.data;
    } catch (error) {
        return error.message;
    }
};