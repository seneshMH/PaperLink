import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

//create message
export const createMessage = async (req, res) => {
    try {
        const { conversationId, userId, desc } = req.body;
        const message = await Message.create({ conversationId, userId, desc });

        await message.save();

        const conversation = await Conversation.findById(conversationId);
        //update conversation last message
        conversation.lastMessage = desc;
        await conversation.save();

        await message.save();
        res.send({
            success: true,
            message: "Message created successfully",
            data: message
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//get messages by conversation id
export const getMessagesByConversationId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new Error("Conversation not found");
        }
        const messages = await Message.find({ conversationId: id });


        res.send({
            success: true,
            data: messages
        });

    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};

//delete message
export const deleteMessage = async (req, res) => {
    try {
        console.log(req.params.id)

        //check id is valid or not
        if (!req.params.id) {
            throw new Error("Message not found");
        }

        //delete message by id
        await Message.findByIdAndDelete(req.params.id);

        //send response
        res.send({
            success: true,
            message: "Message deleted successfully"
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
};