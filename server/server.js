import express from 'express';
import dotenv from 'dotenv';

import userRoute from './routes/user.route.js'
import productRoute from './routes/product.route.js'

const app = express();
dotenv.config();
import connect from './config/db.config.js';

app.use(express.json());

app.use('/api/users',userRoute);
app.use('/api/products',productRoute);

app.listen(8800, () => {
    connect();
    console.log("Backend server is running");
});