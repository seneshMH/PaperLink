import mongoose from "mongoose";
const { Schema } = mongoose;

const paymentSchema = Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
    stripeId: {
      type: String,
      default: "",
    },
    hold: {
      type: Number,
      default: 0,
      required: true,
    },
    fund: {
      type: Number,
      default: 0,
      required: true,
    },
    bank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Payment", paymentSchema);
