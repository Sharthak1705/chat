import mongoose from "mongoose";

const callSchema = new mongoose.Schema({
  caller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  type: { type: String, enum: ["audio", "video"], required: true },
  status: { type: String, enum: ["missed", "completed"], default: "completed" },
});

export default mongoose.model("Call", callSchema);
