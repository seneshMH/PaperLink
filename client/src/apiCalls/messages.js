import { axiosInstance } from "./axios.instance";

//create message
export const createMessage = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/messages/create-message', payload);
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//get messages by conversation id
export const getMessagesByConversationId = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/messages/get-messages/${id}`);
        return response.data;
    } catch (error) {
        return error.message;
    }
};


//delete message
export const deleteMessage = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/messages/delete-message/${id}`);
        return response.data;
    } catch (error) {
        return error.message;
    }
};