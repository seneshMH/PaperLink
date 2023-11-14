import mongoose from "mongoose";
const { Schema } = mongoose;

const conversationSchema = Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    readBySeller: {
        type: Boolean,
        default: false,
        required: true,
    },
    readByBuyer: {
        type: Boolean,
        default: false,
        required: true,
    },
    lastMessage: {
        type: String,
        required: false,
    },
}, {
    timestamps: true
});

conversationSchema.index({ sellerId: 1, buyerId: 1 }, { unique: true });

export default mongoose.model("Conversation", conversationSchema);