import { axiosInstance } from "./axios.instance";

//add bid
export const addBid = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/bids/add-bid', payload);
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//get all bids
export const getBids = async (filters) => {
    try {
        const response = await axiosInstance.post('/api/bids/get-bids', filters);
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//get bid by buyer id
export const getBidByBuyerId = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/bids/get-bids-by-buyer-id/${id}`);
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//delete bid
export const deleteBid = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/bids/delete-bid/${id}`);
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//change bid status
export const changeBidStatus = async (id, status) => {
    try {
        const response = await axiosInstance.put(`/api/bids/change-bid-status/${id}`, { status });
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//change bid paid status
export const changeBidPaidStatus = async (payload) => {
    try {
        const response = await axiosInstance.put(`/api/bids/change-bid-paid-status/`, payload);
        return response.data;
    } catch (error) {
        return error.message;
    }
}

//create checkout session
export const createCheckoutSession = async (id) => {
    try {
        const response = await axiosInstance.post("/api/bids/create-checkout-session/", { bidId: id });
        return response.data;
    } catch (error) {
        return error.message;
    }
}

