import stripe from "../config/stripe.config.js"
import Bid from '../models/bid.model.js';
import Notification from '../models/notification.model.js';
import User from '../models/user.model.js';

//add new bid
export const addBid = async (req, res) => {
    try {
        //create new bid
        const bid = await Bid.create(req.body);

        //send notification to buyer
        const seller = await User.findById(req.body.seller);

        const newNotification = new Notification({
            user: req.body.buyer,
            message: `New Bid added by ${seller.name}`,
            title: "New Bid",
            onClick: "/papermaker-dashboard",
            read: false,
        });

        await newNotification.save();

        //send response
        res.send({
            success: true,
            message: "Bid added successfully",
            data: bid
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//get bid by buyer id and paid status
export const getBidsByBuyer = async (req, res) => {
    try {
        //get buyer id
        const buyerId = req.params.id;

        if (!buyerId) {
            throw new Error("Buyer details not found");
        }

        //find bid by buyer id and paid status
        const bids = await Bid.find({ buyer: buyerId, paid: true }).populate('advertisement').populate('seller');

        //send response
        res.send({
            success: true,
            data: bids
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//get all bids
export const getAllBids = async (req, res) => {
    try {
        const { advertisement, seller, buyer } = req.body;
        let filters = {};

        if (!advertisement) {
            throw new Error("Advertisement Not Found");
        }

        filters.advertisement = advertisement;

        if (seller) {
            filters.seller = seller;
        }

        if (buyer) {
            filters.buyer = buyer;
        }

        const bids = await Bid.find(filters)
            .populate('advertisement')
            .populate('buyer')
            .populate('seller')
            .sort({ createdAt: -1 });

        res.send({
            success: true,
            data: bids
        });

    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//delete bid
export const deleteBid = async (req, res) => {
    try {
        //delete bid by id
        await Bid.findByIdAndDelete(req.params.id);

        //send response
        res.send({
            success: true,
            message: "Bid deleted successfully"
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//change bid status
export const changeBidStatus = async (req, res) => {
    try {
        const { bidId, status } = req.body;

        if (!bidId || !status) {
            throw new Error("Bid details not found");
        }

        //find bid by id and update status
        await Bid.findByIdAndUpdate(bidId, { status: status });

        //send response
        res.send({
            success: true,
            message: "Bid status updated successfully"
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//change bid paid status
export const changeBidPaidStatus = async (req, res) => {
    try {
        const { bidId, paid } = req.body;

        if (!bidId || !paid) {
            throw new Error("Bid details not found");
        }

        //find bid by id and update status
        const bid = await Bid.findById(bidId);
        //check if bid is paid
        if (!bid.paid) {
            bid.paid = true;
            await bid.save();
        }

        //send response
        res.send({
            success: true,
            message: "Bid payment successfull"
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

        const { bidId, userId } = req.body;

        if (!bidId || !userId) {
            throw new Error("Bid details not found");
        }

        //find bid by id
        const bid = await Bid.findById(bidId);

        if (!bid) {
            throw new Error("Bid not found");
        }

        const unitAmount = Math.round(parseFloat(bid.bidAmount) * 100);
        const lineItems = [{
            price_data: {
                currency: "lkr",
                product_data: {
                    name: "Bid",
                },
                unit_amount: unitAmount,
            },
            quantity: "1",
        }];

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: lineItems,

            success_url: `${process.env.CLIENT_URL}/bid/success/${bid._id}`,
            cancel_url: `${process.env.CLIENT_URL}/bid/cancel/${bid._id}`,
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