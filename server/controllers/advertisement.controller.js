import Advertisement from "../models/advertisement.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

//Add a new Advertisement
export const addAdvertisement = async (req, res) => {
    try {
        //create new Advertisement
        const newAdvertisement = new Advertisement(req.body);

        //save new Advertisement
        await newAdvertisement.save();

        //send notification to admin
        const admins = await User.find({ role: "admin" });
        const buyer = await User.findById(req.body.buyer);
        admins.forEach(async (admin) => {
            const newNotification = new Notification({
                user: admin._id,
                message: `New Advertisement added by ${buyer.name}`,
                title: "New Advertisement",
                onClick: "/admin-dashboard",
                read: false,
            });
            await newNotification.save();
        });

        //send response
        res.send({
            success: true,
            message: "Advertisement added successfully",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//get all Advertisements
export const getAllAdvertisements = async (req, res) => {
    try {
        const { buyer, category = [], status } = req.body;

        let filters = {};
        if (buyer) {
            filters.buyer = buyer;
        }

        if (status) {
            filters.status = status;
        }

        //filter by category
        if (category.length > 0) {
            filters.category = { $in: category };
        }

        //find all Advertisements
        const advertisements = await Advertisement.find(filters).populate("buyer").sort({ createdAt: -1 });

        //send response
        res.send({
            success: true,
            message: "Advertisements fetched successfully",
            data: advertisements
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//update Advertisement
export const updateAdvertisement = async (req, res) => {
    try {
        await Advertisement.findByIdAndUpdate(req.params.id, req.body);

        //send response
        res.send({
            success: true,
            message: "Advertisement updated successfully"
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//get Advertisement by id
export const getAdvertisementById = async (req, res) => {
    try {
        //find Advertisement by id
        const advertisement = await Advertisement.findById(req.params.id).populate("buyer");
        //send response
        res.send({
            success: true,
            message: "Advertisement fetched successfully",
            data: advertisement
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//delete Advertisement
export const deleteAdvertisement = async (req, res) => {
    try {
        //delete Advertisement by id
        await Advertisement.findByIdAndDelete(req.params.id);

        //send response
        res.send({
            success: true,
            message: "Advertisement deleted successfully"
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//update Advertisement status
export const updateAdvertisementStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updateAdvertisement = await Advertisement.findByIdAndUpdate(req.params.id, { status });

        //send notification to buyer
        const newNotification = new Notification({
            user: updateAdvertisement.buyer,
            message: `Your Advertisement status is ${status}`,
            title: "Advertisement Status",
            onClick: "/buyer",
            read: false,
        });
        await newNotification.save();

        //send response
        res.send({
            success: true,
            message: "Advertisement status updated successfully"
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};
