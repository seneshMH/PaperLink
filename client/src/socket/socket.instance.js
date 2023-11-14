import { io } from "socket.io-client";

const ENDPOINT = "https://paperlink.onrender.com:10000";

export const socket = io(ENDPOINT, {
    autoConnect: false,
});
