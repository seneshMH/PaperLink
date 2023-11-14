import stripe from "../config/stripe.config.js";
import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import Bank from "../models/bank.model.js";
import ProductOrder from "../models/product.order.model.js";
import Bid from "../models/bid.model.js";
import { getSocket } from "../sockets/socket.js";
import Notification from "../models/notification.model.js";

//get stripe public key
export const getStripePublishableKey = async (req, res) => {
    try {
        //send response
        res.send({
            success: true,
            message: "Stripe public key fetched successfully",
            data: process.env.STRIPE_PUBLISHABLE_KEY,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
};

//create payment details
export const createPaymentDetails = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            throw new Error("User not found");
        }

        //get user by id
        const user = User.findById(userId);

        //create payment details
        const paymentDetails = new Payment({
            user: userId,
        });

        //save payment details
        const savedPaymentDetails = await paymentDetails.save();

        //send response
        res.send({
            success: true,
            message: "Payment details saved successfully",
            data: savedPaymentDetails,
        });
    } catch (error) {
        console.log(error.message);
        res.send({
            success: false,
            message: error.message,
        });
    }
};

//get payment details by user id
export const getPaymentDetailsByUserId = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            throw new Error("User not found");
        }

        //find payment details by user id
        const paymentDetails = await Payment.findOne({ user: id });

        //send response
        res.send({
            success: true,
            message: "Payment details retrieved successfully",
            data: paymentDetails,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
};

//get payment details of a user
export const getPaymentDetails = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            throw new Error("User id not found");
        }

        //find payment details by user id
        const paymentDetails = await Payment.findOne({
            user: userId,
        }).populate("bank");

        //send response
        res.send({
            success: true,
            message: "Payment details retrieved successfully",
            data: paymentDetails,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
};

// Create bank account
export const createBankAccount = async (req, res) => {
    try {
        const { account, userId } = req.body;

        if (
            !account.bank_name ||
            !account.branch_name ||
            !account.account_number ||
            !account.account_holder_name ||
            !userId
        ) {
            throw new Error("Required fields not found");
        }

        // Find payment details by user id
        const paymentDetails = await Payment.findOne({ user: userId }).populate("bank");

        let bankAccount = paymentDetails.bank;

        // If bank account does not exist
        if (!bankAccount) {
            // Create a new bank account document
            bankAccount = await Bank.create(account);

            // Update payment details with bank information
            await Payment.findOneAndUpdate({ user: userId }, { bank: bankAccount._id });

            // Update paymentDetails.bank.stripeId
            paymentDetails.bank = bankAccount._id;
            await paymentDetails.save();
        } else {
            await Bank.findByIdAndUpdate(bankAccount._id, account);
        }

        // Send response
        res.send({
            success: true,
            message: "Bank account created successfully",
            data: bankAccount,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
};

//create stripe account
export const createStripeAccount = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw new Error("Email not found");
        }

        const account = await stripe.accounts.create({
            type: "express",
            country: "LK",
            email,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
        });

        //send response
        res.send({
            success: true,
            message: "Stripe account created successfully",
            data: account,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
};

//retrieve stripe account
export const retrieveStripeAccount = async (req, res) => {
    try {
        const { account_id } = req.body;

        if (!account_id) {
            throw new Error("Account id not found");
        }

        const account = await stripe.accounts.retrieve(account_id);

        //send response
        res.send({
            success: true,
            message: "Stripe account retrieved successfully",
            data: account,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
};

//create stripe account link
export const createStripeAccountLink = async (req, res) => {
    try {
        const { account_id } = req.body;

        if (!account_id) {
            throw new Error("Account id not found");
        }

        const accountLink = await stripe.accountLinks.create({
            account: account_id,
            refresh_url: "https://example.com/reauth",
            return_url: "https://example.com/return",
            type: "account_onboarding",
        });

        //send response
        res.send({
            success: true,
            message: "Stripe account link created successfully",
            data: accountLink,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
};

//Add bank account to stripe account
export const addBankAccountToStripeAccount = async (req, res) => {
    try {
        const { account_id, bank_account } = req.body;

        if (!account_id || !bank_account) {
            throw new Error("Account id or bank account not found");
        }

        const bankAccount = await stripe.accounts.createExternalAccount(account_id, {
            external_account: bank_account,
        });

        //send response
        res.send({
            success: true,
            message: "Bank account added to stripe account successfully",
            data: bankAccount,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
};

//Add card to stripe account
export const addCardToStripeAccount = async (req, res) => {
    try {
        const { account_id, card } = req.body;

        if (!account_id || !card) {
            throw new Error("Account id or card not found");
        }

        const cardDetails = await stripe.accounts.createExternalAccount(account_id, {
            external_account: card,
        });

        //send response
        res.send({
            success: true,
            message: "Card added to stripe account successfully",
            data: cardDetails,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
};

//transfer money to stripe account
export const transferMoneyToStripeAccount = async (req, res) => {
    try {
        const { account_id, amount } = req.body;

        if (!account_id || !amount) {
            throw new Error("Account id or amount not found");
        }

        const transfer = await stripe.transfers.create({
            amount: amount,
            currency: "LKR",
            destination: account_id,
        });

        //send response
        res.send({
            success: true,
            message: "Money transfered to stripe account successfully",
            data: transfer,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
};

//release paper order payment from hold
export const releasePaperOrderPaymentFromHold = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            throw new Error("order not found");
        }

        const order = await ProductOrder.findById(orderId).populate("product");

        if (!order) {
            throw new Error("order not found");
        }

        let payment = await Payment.findOne({ user: order.product.seller });

        if (!payment) {
            payment = await Payment.create({ user: order.product.seller });
        }

        payment.hold -= order.price * order.quantity;
        payment.fund += order.price * order.quantity;

        await payment.save();

        order.status = "completed";

        await order.save();

        //send notification to seller
        const notification = {
            title: "Payment released",
            message: `For Order ${order._id} payment released successfully`,
            onClick: "",
            user: order.buyer,
            read: false,
        };

        getSocket().to(order.product.seller).emit("new_notification", notification);

        await Notification.create(notification);

        //send response
        res.send({
            success: true,
            message: "Payment released successfully",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
};

//relase bid payment from hold
export const releaseBidPaymentFromHold = async (req, res) => {
    try {
        const { bidId } = req.body;

        if (!bidId) {
            throw new Error("Bid not found");
        }

        const bid = await Bid.findById(bidId);

        if (!bid) {
            throw new Error("Bid not found");
        }

        let payment = await Payment.findOne({ user: bid.seller });

        if (!payment) {
            payment = await Payment.create({ user: bid.seller });
        }

        payment.hold -= bid.bidAmount;
        payment.fund += bid.bidAmount;

        await payment.save();

        bid.status = "completed";

        await bid.save();

        //send notification to seller
        const notification = {
            title: "Payment released",
            message: `For Bid ${bid._id} payment released successfully`,
            onClick: "",
            user: bid.buyer,
            read: false,
        };

        getSocket().to(bid.seller).emit("new_notification", notification);

        await Notification.create(notification);

        //send response
        res.send({
            success: true,
            message: "Payment released successfully",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
};

//refund paper order payment
export const refundPaperOrderPayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            throw new Error("order not found");
        }

        const order = await ProductOrder.findById(orderId).populate("product");

        if (!order) {
            throw new Error("order not found");
        }

        let payment = await Payment.findOne({ user: order.buyer });

        if (!payment) {
            payment = await Payment.create({ user: order.buyer });
        }

        payment.fund += order.price * order.quantity;

        await payment.save();

        order.status = "refunded";

        await order.save();

        //send notification to buyer
        const notification = {
            title: "Payment refunded",
            message: `For Order ${order._id} payment refunded successfully`,
            onClick: "",
            user: order.buyer,
            read: false,
        };

        getSocket().to(order.buyer).emit("new_notification", notification);

        await Notification.create(notification);

        //send notification to seller
        const notification2 = {
            title: "Payment refunded",
            message: `For Order ${order._id} payment refunded`,
            onClick: "",
            user: order.product.seller,
            read: false,
        };

        getSocket().to(order.product.seller).emit("new_notification", notification2);

        await Notification.create(notification2);

        //send response
        res.send({
            success: true,
            message: "Payment refunded successfully",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
};

//refund bid payment
export const refundBidPayment = async (req, res) => {
    try {
        const { bidId } = req.body;

        if (!bidId) {
            throw new Error("Bid not found");
        }

        const bid = await Bid.findById(bidId);

        if (!bid) {
            throw new Error("Bid not found");
        }

        let payment = await Payment.findOne({ user: bid.buyer });

        if (!payment) {
            payment = await Payment.create({ user: bid.buyer });
        }

        payment.fund += bid.bidAmount;

        await payment.save();

        bid.status = "refunded";

        await bid.save();

        //send notification to buyer
        const notification = {
            title: "Payment refunded",
            message: `For Bid ${bid._id} payment refunded successfully`,
            onClick: "",
            user: bid.buyer,
            read: false,
        };

        getSocket().to(bid.buyer).emit("new_notification", notification);

        await Notification.create(notification);

        //send notification to seller
        const notification2 = {
            title: "Payment refunded",
            message: `For Bid ${bid._id} payment refunded`,
            onClick: "",
            user: bid.seller,
            read: false,
        };

        getSocket().to(bid.seller).emit("new_notification", notification2);

        await Notification.create(notification2);

        //send response
        res.send({
            success: true,
            message: "Payment refunded successfully",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
};
