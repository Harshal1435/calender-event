import express from "express"
import mongoose from "mongoose"
import Goal from "../models/goalModel.js"

const router = express.Router()

// Get all goals
router.get("/", async (req, res) => {
  try {
    const goals = await Goal.find()
    res.status(200).json(goals)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

// Create a new goal
router.post("/", async (req, res) => {
  const goal = req.body
  const newGoal = new Goal(goal)

  try {
    await newGoal.save()
    res.status(201).json(newGoal)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
})

// Update a goal
router.put("/:id", async (req, res) => {
  const { id } = req.params
  const goal = req.body

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("No goal with that id")
  }

  try {
    const updatedGoal = await Goal.findByIdAndUpdate(id, goal, { new: true })
    res.json(updatedGoal)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
})

// Delete a goal
router.delete("/:id", async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("No goal with that id")
  }

  try {
    await Goal.findByIdAndRemove(id)
    res.json({ message: "Goal deleted successfully" })
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
})

export default router
