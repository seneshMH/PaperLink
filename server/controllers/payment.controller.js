import stripe from "../config/stripe.config.js";
import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import Bank from "../models/bank.model.js";

//get stripe public key
export const getStripePublishableKey = async (req, res) => {
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

//create payment details
export const createPaymentDetails = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            throw new Error("User not found");
        }

        //get user by id
        const user = User.findById(userId);

        //create stripe account
        const account = await stripe.accounts.create({
            type: "express",
            country: 'US',
            email: user.email,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
            // tos_acceptance: {
            //     service_agreement: 'recipient',
            // },
        });

        //create payment details
        const paymentDetails = new Payment({
            user: userId,
            stripeId: account.id,
        });

        //save payment details
        const savedPaymentDetails = await paymentDetails.save();

        //send response
        res.send({
            success: true,
            message: "Payment details saved successfully",
            data: savedPaymentDetails
        });
    } catch (error) {
        console.log(error.message)
        res.send({
            success: false,
            message: error.message
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
            user: userId
        }).populate(
            "bank"
        );

        //send response
        res.send({
            success: true,
            message: "Payment details retrieved successfully",
            data: paymentDetails
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

// Create bank account
export const createBankAccount = async (req, res) => {
    try {
        const { account, userId } = req.body;

        if (!account.account_number || !account.currency || !account.country || !account.account_holder_name || !userId) {
            throw new Error("Required fields not found");
        }

        // Find payment details by user id
        const paymentDetails = await Payment.findOne({ user: userId }).populate("bank");

        let bankAccount = paymentDetails.bank;

        // Set the correct object type for bank account
        account.object = 'bank_account';

        // If bank account does not exist
        if (!bankAccount) {
            // Create bank account
            const response = await stripe.accounts.createExternalAccount(
                paymentDetails.stripeId,
                {
                    external_account: {
                        object: 'bank_account', // Set the correct object type
                        account_holder_name: account.account_holder_name,
                        account_number: account.account_number,
                        currency: account.currency,
                        country: account.country,
                        routing_number: account.routing_number
                    },
                }
            );

            if (response.error) {
                throw new Error(response.error.message);
            }

            // Create a new bank account document
            bankAccount = await Bank.create(account);

            // Update payment details with bank information
            await Payment.findOneAndUpdate({ user: userId }, { bank: bankAccount._id });

            // Update the bank account document with the Stripe ID
            await Bank.findByIdAndUpdate(bankAccount._id, { stripeId: response.id });

            // Update paymentDetails.bank.stripeId
            paymentDetails.bank = bankAccount._id;
            paymentDetails.bank.stripeId = response.id;
            await paymentDetails.save();
        } else {
            console.log(paymentDetails)
            // Delete the existing bank account
            let response = await stripe.accounts.deleteExternalAccount(paymentDetails.stripeId, paymentDetails.bank.stripeId);

            if (response.error) {
                throw new Error(response.error.message);
            }


            // Create a new bank account
            response = await stripe.accounts.createExternalAccount(
                paymentDetails.stripeId,
                {
                    external_account: {
                        account_holder_name: account.account_holder_name,
                        object: 'bank_account', // Set the correct object type
                        account_number: account.account_number,
                        currency: account.currency,
                        country: account.country,
                        routing_number: account.routing_number
                    },
                }
            );

            if (response.error) {
                throw new Error(response.error.message);
            }



            // Update the existing bank account document
            account.stripeId = response.id;
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
            country: 'LK',
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
            data: account
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
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
            data: account
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
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
            refresh_url: 'https://example.com/reauth',
            return_url: 'https://example.com/return',
            type: 'account_onboarding',
        });

        //send response
        res.send({
            success: true,
            message: "Stripe account link created successfully",
            data: accountLink
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
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

        const bankAccount = await stripe.accounts.createExternalAccount(
            account_id,
            {
                external_account: bank_account,
            }
        );

        //send response
        res.send({
            success: true,
            message: "Bank account added to stripe account successfully",
            data: bankAccount
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
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

        const cardDetails = await stripe.accounts.createExternalAccount(
            account_id,
            {
                external_account: card,
            }
        );

        //send response
        res.send({
            success: true,
            message: "Card added to stripe account successfully",
            data: cardDetails
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
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
            currency: 'LKR',
            destination: account_id,
        });

        //send response
        res.send({
            success: true,
            message: "Money transfered to stripe account successfully",
            data: transfer
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

