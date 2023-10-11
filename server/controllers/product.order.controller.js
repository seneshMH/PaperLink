import stripe from "../config/stripe.config.js"
import axios from "axios";

import ProductOrder from "../models/product.order.model.js";
import Product from "../models/product.model.js";
import TempProductOrder from "../models/temp.product.order.model.js";


//get stripe public key
export const getStripePublicKey = async (req, res) => {
    try {
        //send response
        res.send({
            success: true,
            message: "Stripe public key fetched successfully",
            data: process.env.STRIPE_PUBLISHABLE_KEY
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//create payment intent
export const createPaymentIntent = async (req, res) => {
    try {

        if (!req.body.amount) {
            throw new Error("Amount not found");
        }

        const amountInCents = Math.round(req.body.amount * 100);

        //create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: "usd",
            payment_method_types: ["card"],
        });

        //send response
        res.send({
            success: true,
            message: "Payment intent created successfully",
            data: paymentIntent
        });
    } catch (error) {

        res.send({
            success: false,
            message: error.message
        });
    }
};

//create product order
export const createProductOrder = async (req, res) => {
    try {

        const { product, buyer, price, quantity } = req.body;

        if (!product || !buyer || !price || !quantity) {
            throw new Error("Product order details not found");
        }

        //create product order
        const productOrder = await ProductOrder.create({
            product,
            buyer,
            price,
            quantity
        });

        //send response
        res.send({
            success: true,
            message: "Product order created successfully",
            data: productOrder
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//get product orders
export const getProductOrders = async (req, res) => {
    try {
        const productOrders = await ProductOrder.find({}).populate("product").populate("buyer");

        //send response
        res.send({
            success: true,
            message: "Product orders fetched successfully",
            data: productOrders
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//get product order by buyer
export const getProductOrderByBuyer = async (req, res) => {
    try {

        if (!req.params.id) {
            throw new Error("Buyer id not found");
        }

        const productOrders = await ProductOrder.find({ buyer: req.params.id }).populate("product").populate({
            path: "product",
            populate: {
                path: "seller",
                model: "User" // Replace "Seller" with the actual model name for the seller
            }
        }).populate("buyer");



        //send response
        res.send({
            success: true,
            message: "Product orders fetched successfully",
            data: productOrders
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

// Get product orders by seller
export const getProductOrderBySeller = async (req, res) => {
    try {
        if (!req.params.id) {
            throw new Error("Seller id not found");
        }

        // Find product orders where the seller matches the given seller id
        const productOrders = await ProductOrder.find({}).populate({
            path: "product",
            match: { seller: req.params.id }, // Filter by seller id
        }).populate("buyer");

        // Filter out product orders where the product field is null (no matching product found)
        const filteredProductOrders = productOrders.filter(
            (order) => order.product !== null
        );

        // Send response
        res.send({
            success: true,
            message: "Product orders fetched successfully",
            data: filteredProductOrders,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
};

//delete product order
export const deleteProductOrder = async (req, res) => {
    try {

        if (!req.params.id) {
            throw new Error("Product order id not found");
        }

        await ProductOrder.findByIdAndDelete(req.params.id);

        //send response
        res.send({
            success: true,
            message: "Product order deleted successfully"
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//change product order status 
export const changeProductOrderStatus = async (req, res) => {
    try {

        const { status } = req.body;

        if (!req.params.id) {
            throw new Error("Product order id not found");
        }

        if (!status) {
            throw new Error("Product order status not found");
        }

        //find by id and update
        const response = await ProductOrder.findByIdAndUpdate(req.params.id, { status: status });


        //send response
        res.send({
            success: true,
            message: "Product order status updated successfully"
        });

    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//create checkout session
export const createCheckoutSession = async (req, res) => {
    try {

        const { items, userId } = req.body;

        if (!items || !userId) {
            throw new Error("Product order details not found");
        }

        //find product by id
        const products = await Promise.all(items.map(async (item) => {
            const product = await Product.findById(item.product);

            if (!product) {
                throw new Error(`Product not found for ID: ${item.product}`);
            }

            return { product, quantity: item.quantity };
        }));

        let productOrderIds = [];
        //save product orders
        await Promise.all(products.map(async (item) => {
            const productOrder = await ProductOrder.create({
                product: item.product._id,
                buyer: userId,
                price: item.product.price,
                quantity: item.quantity
            });

            productOrderIds.push(productOrder._id);

            return productOrder;
        }));

        //create temp product order
        const tempProductOrder = await TempProductOrder.create({
            orders: productOrderIds
        });

        const lineItems = products.map((item) => {
            const unitAmount = Math.round(parseFloat(item.product.price) * 100);

            return {
                price_data: {
                    currency: "lkr",
                    product_data: {
                        name: item.product.name,
                    },
                    unit_amount: unitAmount,
                },
                quantity: item.quantity,
            }
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: lineItems,
            customer_email: 'customer@example.com', // Associate with the customer's email


            success_url: `${process.env.CLIENT_URL}/order/success/${tempProductOrder._id}`,
            cancel_url: `${process.env.CLIENT_URL}/order/cancel/${tempProductOrder._id}`,
        });

        //send response
        res.send({
            success: true,
            message: "Checkout session created successfully",
            data: session.url
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//cancle order
export const cancelOrder = async (req, res) => {
    try {

        const id = req.params.id;

        if (!id) {
            throw new Error("Order id not found");
        }

        //delete product order
        //first find temp product order
        const tempProductOrder = await TempProductOrder.findById(id);

        if (!tempProductOrder) {
            return;
        }

        //delete product orders
        await Promise.all(tempProductOrder.orders.map(async (item) => {
            await ProductOrder.findByIdAndDelete(item);
        }));

        //find by id and update
        await TempProductOrder.findByIdAndDelete(id);

        //send response
        res.send({
            success: true,
            message: "Order canceled successfully"
        });

    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//order success
export const orderSuccess = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            throw new Error("Order id not found");
        }

        //delete temp product order
        await TempProductOrder.findByIdAndDelete(id);

        //send response
        res.send({
            success: true,
            message: "Order success"
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};
