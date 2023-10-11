import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        default: "",
        // required: true
    },
    phone: {
        type: Number,
        // required: true,
        default: "",
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        default: "buyer"
    },
    status: {
        type: String,
        default: "active"
    },
    rating: {
        type: Number,
        default: 0.0
    },
    totalRatings: {
        type: Number,
        default: 0,
        required: true
    },
    profilePicture: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

export default mongoose.model("User", userSchema);