import mongoose from "mongoose";
const { Schema } = mongoose;

const bankSchema = Schema(
    {
        bank_name: {
            type: String,
            required: true,
        },
        branch_name: {
            type: String,
            required: true,
        },
        account_number: {
            type: Number,
            required: true,
        },
        account_holder_name: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Bank", bankSchema);
