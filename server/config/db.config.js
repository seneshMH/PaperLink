import mongoose from 'mongoose';

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to mongodb");
    } catch (error) {
        console.log(error);
    }
}

export default connect;