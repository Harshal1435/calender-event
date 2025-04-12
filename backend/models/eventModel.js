import mongoose from "mongoose"

const eventSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
     
      
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    color: {
      type: String,
      required: false,
    },
    relatedGoal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      required: false,
    },
  },
  {
    timestamps: true,
  },
)

const Event = mongoose.model("Event", eventSchema)

export default Event
