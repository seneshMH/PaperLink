import { axiosInstance } from "./axios.instance";

//send mail
export const sendMail = async (data) => {
    try {
        const response = await axiosInstance.post('/api/mails/send-mail', data);
        return response.data;
    } catch (error) {
        return error.message;
    }
}