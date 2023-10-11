import Conversation from "../models/conversation.model.js";

//find conversation if not create one
export const findOrCreateConversation = async (req, res) => {
    const { sellerId, buyerId } = req.body;
    try {

        let conversation = await Conversation.findOne({ sellerId, buyerId });

        if (!conversation) {
            conversation = await Conversation.create({ sellerId, buyerId });
        }

        res.send({
            success: true,
            data: conversation
        });

    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error, conversation already exists
            const existingConversation = await Conversation.findOne({ sellerId, buyerId });
            res.send({
                success: true,
                data: existingConversation
            });
        } else {
            res.send({
                success: false,
                message: error.message
            });
        }
    }
};

//update conversation
export const updateConversation = async (req, res) => {
    try {
        const { conversationId, readBySeller, readByBuyer, lastMessage } = req.body;
        const conversation = await Conversation.findById(conversationId);

        if (conversation) {
            conversation.readBySeller = readBySeller;
            conversation.readByBuyer = readByBuyer;
            conversation.lastMessage = lastMessage;

            await conversation.save();
            res.send({
                success: true,
                message: "Conversation updated successfully",
            });
        } else {
            res.send({
                success: false,
                message: "Conversation not found",
            });
        }
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//get single conversation
export const getSingleConversation = async (req, res) => {
    try {
        const conversationId = req.params.id;
        const conversation = await Conversation.findById(conversationId);

        if (conversation) {
            res.send({
                success: true,
                data: conversation
            });
        } else {
            res.send({
                success: false,
                message: "Conversation not found",
            });
        }
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//get all conversations
export const getAllConversations = async (req, res) => {
    try {
        const { sellerId, buyerId } = req.body;
        let filters = {};
        if (sellerId) {
            filters.sellerId = sellerId;
        }

        if (buyerId) {
            filters.buyerId = buyerId;
        }

        const conversations = await Conversation.find(filters)
            .populate('sellerId')
            .populate('buyerId')
            .sort({ createdAt: -1 });

        res.send({
            success: true,
            data: conversations
        });

    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};