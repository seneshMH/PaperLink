import mongoose from "mongoose";
const { Schema } = mongoose;

const tempProductOrderSchema = new Schema({
    orders: {
        type: Array,
        default: [],
    },
}, {
    timestamps: true
});

export default mongoose.model("TempProductOrder", tempProductOrderSchema);