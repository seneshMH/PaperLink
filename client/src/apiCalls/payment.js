import { axiosInstance } from "./axios.instance";

//get stripe publishable key
export const getStripePublishableKey = async () => {
  try {
    const response = await axiosInstance.get("/api/payments/get-stripe-publishable-key");
    return response.data;
  } catch (error) {
    throw error;
  }
};

//create payment details
export const createPaymentDetails = async () => {
  try {
    const response = await axiosInstance.post("/api/payments/create-payment-details");
    return response.data;
  } catch (error) {
    throw error;
  }
};

//get payment details
export const getPaymentDetails = async (paymentId) => {
  try {
    const response = await axiosInstance.post("/api/payments/get-payment-details");
    return response.data;
  } catch (error) {
    throw error;
  }
};

//create bank account
export const createBankAccount = async (bankDetails) => {
  try {
    const response = await axiosInstance.post("/api/payments/create-bank-account", bankDetails);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//update bank details
export const updateBankDetails = async (bankDetails) => {
  try {
    const response = await axiosInstance.post("/api/payments/update-bank-details", bankDetails);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//release paper oder payment from hold
export const ReleasePaymentFromHold = async (orderId) => {
  try {
    const response = await axiosInstance.post("/api/payments/release-paper-order-payment", { orderId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//release bid payment from hold
export const ReleaseBidPaymentFromHold = async (bidId) => {
  try {
    const response = await axiosInstance.post("/api/payments/release-bid-payment", { bidId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//refund paper order payment
export const RefundPaperOrderPayment = async (orderId) => {
  try {
    const response = await axiosInstance.post("/api/payments/refund-paper-order-payment", { orderId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//refund bid payment
export const RefundBidPayment = async (bidId) => {
  try {
    const response = await axiosInstance.post("/api/payments/refund-bid-payment", { bidId });
    return response.data;
  } catch (error) {
    throw error;
  }
};
