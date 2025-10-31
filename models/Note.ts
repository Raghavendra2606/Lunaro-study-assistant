import mongoose from "mongoose"

const noteSchema = new mongoose.Schema(
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
    content: {
      type: String,
      default: "",
    },
    subject: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
)

export default mongoose.models.Note || mongoose.model("Note", noteSchema)
