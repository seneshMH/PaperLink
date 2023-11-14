import { io } from "socket.io-client";

const ENDPOINT = process.env.NODE_ENV === "production" ? undefined : "http://localhost:5000";

export const socket = io(ENDPOINT, {
    autoConnect: false,
});
