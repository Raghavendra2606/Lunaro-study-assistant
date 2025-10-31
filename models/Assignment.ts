import mongoose from "mongoose"

const assignmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    subject: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Submitted", "Graded"],
      default: "Pending",
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
)

export default mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema)
