import mongoose from "mongoose";
const { Schema } = mongoose;

const bidsSchema = Schema({
    advertisement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Advertisement',
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    bidAmount: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "pending",
        required: true
    },
    paid: {
        type: Boolean,
        default: false,
        required: true
    },
}, {
    timestamps: true
});

export default mongoose.model("Bids", bidsSchema);