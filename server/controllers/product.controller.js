import multer from 'multer';
import cloudinary from '../config/cloudinary.config.js';

import Product from '../models/product.model.js';
import Notification from '../models/notification.model.js';


//add a new product
export const addProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();

        //send notification to admin
        const admins = await User.find({ role: "admin" });
        admins.forEach(async (admin) => {
            const newNotification = new Notification({
                user: admin._id,
                message: `New product added by ${req.user.name}`,
                title: "New Product",
                onClick: "/admin",
                read: false
            });
            await newNotification.save();
        });

        res.send({
            success: true,
            message: "Product Added successfully"
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//get all products
export const getAllProducts = async (req, res) => {
    try {
        const { seller, category = [], status } = req.body;
        let filters = {};
        if (seller) {
            filters.seller = seller;
        }

        if (status) {
            filters.status = status;
        }

        //filter by category
        if (category.length > 0) {
            filters.category = { $in: category };
        }

        const products = await Products.find(filters).populate('seller').sort({ createdAt: -1 });

        res.send({
            success: true,
            data: products
        });

    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//update product
export const updateProduct = async (req, res) => {
    try {
        await Products.findByIdAndUpdate(req.params.id, req.body);

        res.send({
            success: true,
            message: "Product updated successfully"
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//get product by id
export const getProductById = async (req, res) => {
    try {
        const product = await Products.findById(req.params.id).populate('seller');

        res.send({
            success: true,
            data: product
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//delete product
export const deleteProduct = async (req, res) => {
    try {
        await Products.findByIdAndDelete(req.params.id);

        res.send({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//Update Product status
export const updateProductStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updatedProduct = await Products.findByIdAndUpdate(req.params.id, { status });

        //send notification to seller
        const newNotification = new Notification({
            user: updatedProduct.seller,
            message: `Your product ${updatedProduct.name} status has been changed to ${status}`,
            title: "Product Status Updated",
            onClick: "/profile",
            read: false
        });

        await newNotification.save();

        res.send({
            success: true,
            message: "Product status updated successfully"
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//handle image upload to cloudinary

//get image from pc
const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});

export const uploadProductImage = async (req, res) => {
    try {

        multer({ storage: storage }).single('file');

        //upload to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "paperlink",
        });

        const productId = req.body.productId;
        await Products.findByIdAndUpdate(productId, {
            $push: { images: result.secure_url },
        });
        res.send({
            success: true,
            message: "Image uploaded successfully",
            data: result.secure_url
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};