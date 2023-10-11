import mongoose from "mongoose";
const { Schema } = mongoose;

const paymentSchema = Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    stripeId: {
        type: String,
        required: true,
    },
    hold: {
        type: Number,
        default: 0,
        required: true
    },
    fund: {
        type: Number,
        default: 0,
        required: true
    },
    bank: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bank',
    },
}, {
    timestamps: true
});

paymentSchema.index({ user: 1, stripeId: 1 }, { unique: true });

export default mongoose.model("Payment", paymentSchema);