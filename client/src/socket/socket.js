import { AddNotification } from "../apiCalls/notifications.js";
import { socket } from "./socket.instance.js";

export const setupJoin = (userID) => {
    socket.connect();
    socket.emit("join", userID);
};

export const setupNotificationListener = (addNotification) => {
    socket.on("new_notification", (notification) => {
        addNotification(notification);
    });
};

export const setupConversation = (conversationID) => {
    socket.connect();
    socket.emit("setup_conversation", conversationID);
};

export const setupConnectedListener = (setSocketConnected) => {
    socket.on("conversation_connected", () => {
        setSocketConnected(true);
    });
};

export const setupTypingListener = (setIsTyping, userID) => {
    socket.on("typing", (id) => {
        if (id !== userID) {
            setIsTyping(true);
        }
    });
};

export const setupStopTypingListener = (setIsTyping, userID) => {
    socket.on("stop_typing", (id) => {
        if (id !== userID) {
            setIsTyping(false);
        }
    });
};

export const setupNewMessageListener = (setMessages) => {
    socket.on("new_message", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    });
};

export const setupDeleteMessageListener = (setMessages) => {
    socket.on("delete_message", (messageId) => {
        setMessages((prevMessages) => prevMessages.filter((message) => message._id !== messageId));
    });
};

export const setupAddBidListener = (setBids) => {
    socket.on("add_bid", (bid) => {
        setBids((prevBids) => [...prevBids, bid]);
    });
};

export const setupDeleteBidListener = (setBids) => {
    socket.on("delete_bid", (bidId) => {
        setBids((prevBids) => prevBids.filter((bid) => bid._id !== bidId));
    });
};

//emit a message to the server
export const emitNewMessage = (messageData) => {
    socket.emit("new_message", messageData);
};

//emit delete message to the server
export const emitDeleteMessage = (payload) => {
    socket.emit("delete_message", payload);
};

//emit a bid to the server
export const emitAddBid = (bidData) => {
    socket.emit("add_bid", bidData);
};

//emit delete bid to the server
export const emitDeleteBid = (bidData) => {
    socket.emit("delete_bid", bidData);
};

//emit typing to the server
export const emitTyping = (payload) => {
    socket.emit("typing", payload);
};

//emit stop typing to the server
export const emitStopTyping = (payload) => {
    socket.emit("stop_typing", payload);
};

//emit new notification to the server
export const emitNewNotification = async (notificationData) => {
    socket.emit("new_notification", notificationData);
    await AddNotification(notificationData);
};

//disconnect socket
export const disconnectSocket = () => {
    //socket.disconnect();
    socket.off("conversation_connected");
    socket.off("new_message");
    socket.off("delete_message");
    socket.off("add_bid");
    socket.off("delete_bid");
    socket.off("typing");
    socket.off("stop_typing");
};
