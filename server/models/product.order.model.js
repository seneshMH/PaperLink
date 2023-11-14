import mongoose from "mongoose";
const { Schema } = mongoose;

const productOrderSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
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

export default mongoose.model("ProductOrder", productOrderSchema);