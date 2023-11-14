import { io } from "socket.io-client";

const ENDPOINT = `http://localhost:${process.env.PORT}`;

export const socket = io(ENDPOINT, {
    autoConnect: false,
});
