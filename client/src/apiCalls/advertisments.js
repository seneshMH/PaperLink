import { axiosInstance } from "./axios.instance";

//add advertisment
export const addAdvertisment = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/advertisements/add-advertisement', payload);
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//edit advertisment
export const editAdvertisment = async (id, payload) => {
    try {
        const response = await axiosInstance.put(`/api/advertisements/edit-advertisement/${id}`, payload);
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//get all advertisments
export const getAdvertisments = async (filters) => {
    try {
        const response = await axiosInstance.post('/api/advertisements/get-advertisements', filters);
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//get advertisment by id
export const getAdvertismentById = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/advertisements/get-advertisement-by-id/${id}`);
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//delete advertisment
export const deleteAdvertisment = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/advertisements/delete-advertisement/${id}`);
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//update advertisment status
export const updateAdvertismentStatus = async (id, status) => {
    try {
        const response = await axiosInstance.put(`/api/advertisements/update-advertisement-status/${id}`, { status });
        return response.data;
    } catch (error) {
        return error.message;
    }
};

