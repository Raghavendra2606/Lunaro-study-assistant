import mongoose from "mongoose"

const subjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    teacher: {
      type: String,
      default: "",
    },
    credits: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
)

export default mongoose.models.Subject || mongoose.model("Subject", subjectSchema)
