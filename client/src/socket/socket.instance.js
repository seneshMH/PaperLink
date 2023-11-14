import { io } from "socket.io-client";

const ENDPOINT = `https://paperlink.onrender.com:${process.env.PORT}`;

export const socket = io(ENDPOINT, {
    autoConnect: false,
});
