import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    desc: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

export default mongoose.model("Message", messageSchema);