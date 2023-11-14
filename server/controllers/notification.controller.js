import Notification from "../models/notification.model.js";

//Add notification
export const addNotification = async (req, res) => {
    try {
        const newNotification = new Notification(req.body);
        await newNotification.save();
        res.send({
            success: true,
            message: "Notification added successfully",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
};

//get all notifications by user id
export const getNotificationsByUserId = async (req, res) => {
    try {
        const notifications = await Notification.find({
            user: req.body.userId
        }).sort({ createdAt: -1 });


        res.send({
            success: true,
            data: notifications,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
}

//delete notification by id
export const deleteNotification = async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.send({
            success: true,
            message: "Notification deleted successfully",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
};

//read all notifications
export const readAllNotifications = async (req, res) => {
    try {
        await Notification.updateMany({ user: req.body.userId, read: false }, { $set: { read: true } });
        res.send({
            success: true,
            message: "Notifications read successfully",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
};
