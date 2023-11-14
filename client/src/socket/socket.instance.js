import { io } from "socket.io-client";
import dotenv from "dotenv";

dotenv.config();

const ENDPOINT = process.env.PORT;

export const socket = io(ENDPOINT, {
    autoConnect: false,
});
