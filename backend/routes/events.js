import express from "express";
import Event from "../models/eventModel.js";
import mongoose from "mongoose";

const router = express.Router();

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error("Fetch Events Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new event
router.post("/", async (req, res) => {
  const event = req.body;

  try {
    // Optional: Check for duplicates based on title + start time
    const existingEvent = await Event.findOne({
      title: event.title,
      start: new Date(event.start),
    });

    if (existingEvent) {
      return res.status(409).json({ message: "Event already exists." });
    }

    // Ensure start and end are ISO strings
    event.start = new Date(event.start).toISOString();
    event.end = new Date(event.end).toISOString();

    const newEvent = new Event(event);
    await newEvent.save();

    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Create Event Error:", error);
    res.status(400).json({ message: error.message });
  }
});

// Update an event
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const event = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("No event with that ID.");
  }

  try {
    // Ensure dates are ISO strings if present
    if (event.start) event.start = new Date(event.start).toISOString();
    if (event.end) event.end = new Date(event.end).toISOString();

    const updatedEvent = await Event.findByIdAndUpdate(id, event, { new: true });
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Update Event Error:", error);
    res.status(400).json({ message: error.message });
  }
});

// Delete an event
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Received delete request for ID:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("Invalid ID format.");
  }

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "No event found with that ID." });
    }
    res.status(200).json({ message: "Event deleted successfully", deletedEvent });
  } catch (error) {
    console.error("Delete Event Error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
