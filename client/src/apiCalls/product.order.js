import { axiosInstance } from "./axios.instance";

//get stripe publishable key
export const GetStripePublishableKey = async () => {
    try {
        const response = await axiosInstance.get('/api/product-order/get-config');
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//create payment intent
export const CreatePaymentIntent = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/product-order/create-payment-intent', payload);
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//get exchange rate
export const GetExchangeRate = async () => {
    try {
        const response = await axiosInstance.get('/api/product-order/get-exchange-rate');
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//create order
export const CreateOrder = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/product-order/create-product-order', payload);
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//get orders
export const GetOrders = async (payload) => {
    try {
        const response = await axiosInstance.get('/api/product-order/get-product-orders');
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//get order by buyer
export const GetOrderByBuyer = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/product-order/get-product-order-by-buyer/${id}`);
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//get order by seller
export const GetOrderBySeller = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/product-order/get-product-order-by-seller/${id}`);
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//delete order
export const DeleteOrder = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/product-order/delete-product-order/${id}`);
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//update order status
export const UpdateOrderStatus = async (id, status) => {
    try {
        const response = await axiosInstance.put(`/api/product-order/change-product-order-status/${id}`, { status });
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//create checkout session
export const CreateCheckoutSession = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/product-order/create-checkout-session', payload);
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//cancle order
export const CancelOrder = async (id) => {
    try {
        const response = await axiosInstance.put(`/api/product-order/cancel-order/${id}`);
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//order success
export const OrderSuccess = async (id) => {
    try {
        const response = await axiosInstance.put(`/api/product-order/order-success/${id}`);
        return response.data;
    } catch (error) {
        return error.message;
    }
};