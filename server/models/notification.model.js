import mongoose from "mongoose";
const { Schema } = mongoose;

const notificationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    onClick: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model("Notification", notificationSchema);
