import mongoose from "mongoose";
const {Schema} = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        default: "user"
    },
    status:{
        type: String,
        default: "active"
    },
    profilePicture:{
        type: String,
        default: ""
    }
},{
    timestamps: true
});

export default mongoose.model("User",userSchema);