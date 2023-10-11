import mongoose from "mongoose";
const { Schema } = mongoose;

const advertisementSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isChemical: {
        type: String,
        default: "off",
        required: true
    },
    isTool: {
        type: String,
        default: "off",
        required: true
    },
    isMaterial: {
        type: String,
        default: "off",
        required: true
    },
    showBidsOnProductPage: {
        type: String,
        default: "off",
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        default: "pending",
        required: true
    },
}, {
    timestamps: true
});

export default mongoose.model("Advertisement", advertisementSchema);