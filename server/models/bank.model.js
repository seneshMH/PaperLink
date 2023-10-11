import mongoose from "mongoose";
const { Schema } = mongoose;

const bankSchema = Schema({
    stripeId: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    account_number: {
        type: Number,
        required: true
    },
    account_holder_name: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

export default mongoose.model("Bank", bankSchema);