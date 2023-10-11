import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        default: [],
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        default: "pending",
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        required: true
    },
    totalRatings: {
        type: Number,
        default: 0,
        required: true
    },
}, {
    timestamps: true
});

export default mongoose.model("Product", productSchema);