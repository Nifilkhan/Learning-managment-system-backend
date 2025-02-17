import mongoose from "mongoose";

export const purchaseSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    paymentId: { type: String, required: true },
    status: { type: string, enum: ["pending", "success","failed"], default: "pending" },
  },
  {
    timestamps: true,
  }
);

const Purchase = mongoose.model("Purchase", purchaseSchema);
export default Purchase;
