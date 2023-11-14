import express from "express";
import dotenv from "dotenv";

import userRoute from "./routes/user.route.js";
import productRoute from "./routes/product.route.js";
import advevertisementRoute from "./routes/advertisement.route.js";
import bidRoute from "./routes/bid.route.js";
import conversationRoute from "./routes/conversation.route.js";
import messageRoute from "./routes/message.route.js";
import Notification from "./routes/notification.route.js";
import productOrderRoute from "./routes/product.order.route.js";
import paymentRoute from "./routes/payment.route.js";
import mailRoute from "./routes/mail.route.js";

import { setupSocketIO } from "./sockets/socket.js";

const app = express();
dotenv.config();

console.clear();

import connect from "./config/db.config.js";

app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/advertisements", advevertisementRoute);
app.use("/api/bids", bidRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/notification", Notification);
app.use("/api/product-order", productOrderRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/mails", mailRoute);

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
    setupSocketIO(server);
    connect();
    console.log(`Backend server is running on port ${port}`);
});

// deployment config
const path = require("path");
__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/client/build")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    });
}
