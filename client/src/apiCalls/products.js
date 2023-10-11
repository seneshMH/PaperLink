import { axiosInstance } from "./axios.instance";

//add a new product
export const AddProduct = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/products/add-product', payload);
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//get all products
export const GetProducts = async (filters) => {
    try {
        const response = await axiosInstance.post('/api/products/get-products', filters);
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//get latest products
export const GetLatestProducts = async () => {
    try {
        const response = await axiosInstance.get('/api/products/get-latest-products');
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//edit product
export const EditProduct = async (id, payload) => {
    try {
        const response = await axiosInstance.put(`/api/products/edit-product/${id}`, payload);
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//get a product by id
export const GetProductById = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/products/get-product-by-id/${id}`);
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//delete a product
export const DeleteProduct = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/products/delete-product/${id}`);
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//Update product status
export const UpdateProductStatus = async (id, status) => {
    try {
        const response = await axiosInstance.put(`/api/products/update-product-status/${id}`, { status });
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//upload product images
export const UploadProductImage = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/products/upload-product-images', payload, {
            timeout: 120000,
        });
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//upload product images
export const UploadProductImages = async (payload) => {
    try {
        const uploadProgress = (progressEvent) => {
            const { loaded, total } = progressEvent;
            const percent = Math.floor((loaded * 100) / total);
            console.log(`${loaded}kb of ${total}kb | ${percent}%`);
        };

        const response = await axiosInstance.post('/api/products/upload-product-images', payload, {
            timeout: 120000,
            onUploadProgress: uploadProgress,
        });
        return response.data;
    } catch (error) {
        return error.message;
    }
};

//delete product image
export const DeleteProductImage = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/products/delete-product-image', payload);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.message;
    }
};

//give rating to product
export const GiveRatingToProduct = async (id, payload) => {
    try {
        const response = await axiosInstance.put(`/api/products/give-rating-to-product/${id}`, payload);
        return response.data;
    } catch (error) {
        return error.message;
    }
};