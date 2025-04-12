import mongoose from "mongoose"

const goalSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Academics", "Learn", "Sports", "ML", "AI", "DE", "Others"],
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

const Goal = mongoose.model("Goal", goalSchema)

export default Goal
