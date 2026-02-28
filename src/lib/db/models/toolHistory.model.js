import mongoose from "mongoose";

const ToolHistorySchema = new mongoose.Schema(
   {
      userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    tool: {
      type: String,
      required: true,
      index: true,
    },

    title: String,

    input: Object,

    output: Object,

    meta: {
      duration: Number,
      status: {
        type: String,
        enum: ["success", "error"],
        default: "success",
      },
    },
   },
   {timestamps:true }
);

export default mongoose.models.ToolHistory || 
mongoose.model("ToolHistory", ToolHistorySchema);