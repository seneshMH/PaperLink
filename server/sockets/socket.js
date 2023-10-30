import { Server } from "socket.io";

let socket_io;

export const getSocket = () => {
    return socket_io;
};

const setSocket = (io) => {
    socket_io = io;
};

export const setupSocketIO = (server) => {
    const io = new Server(server, {
        pingTimeout: 60000,
        cors: {
            origin: "http://localhost:3000",
            // credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("connected to socket.io");
        setSocket(socket);

        socket.on("setup_conversation", (conversationID) => {
            socket.join(conversationID);
            socket.emit("conversation_connected");
            console.log("Room created : " + conversationID);
        });

        socket.on("join", (userId) => {
            socket.join(userId);
            console.log("User Joined: " + userId);
        });

        socket.on("new_notification", ({ userId, notification }) => {
            socket.to(userId).emit("new_notification", notification);
        });

        socket.on("typing", ({ conversationId, userId }) => {
            socket.to(conversationId).emit("typing", userId);
        });

        socket.on("stop_typing", ({ conversationId, userId }) => {
            socket.to(conversationId).emit("stop_typing", userId);
        });

        //new message
        socket.on("new_message", async (message) => {
            try {
                // Emit the new message to the conversation room
                io.in(message.conversationId.toString()).emit("new_message", message);
            } catch (error) {
                console.error(error);
            }
        });

        //delete message
        socket.on("delete_message", async (message) => {
            try {
                // Emit the new message to the conversation room
                io.in(message.conversationId).emit("delete_message", message.messageId);
            } catch (error) {
                console.error(error);
            }
        });

        //add bid
        socket.on("add_bid", async (bidDetails) => {
            try {
                // Emit the new bid to the advertisement room
                io.in(bidDetails.conversationId.toString()).emit("add_bid", bidDetails.bid);
            } catch (error) {
                console.error(error);
            }
        });

        //delete bid
        socket.on("delete_bid", async (bidDetails) => {
            try {
                // Emit the new bid to the advertisement room
                io.in(bidDetails.conversationId).emit("delete_bid", bidDetails.bidId);
            } catch (error) {
                console.error(error);
            }
        });

        socket.off("setup_conversation", () => {
            console.log("USER DISCONNECTED");
            socket.leave();
        });
    });
};
