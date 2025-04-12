import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import eventRoutes from "./routes/events.js"
import goalRoutes from "./routes/goals.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(cors())

// Routes
app.use("/api/events", eventRoutes)
app.use("/api/goals", goalRoutes)

// MongoDB Connection
mongoose
  .connect("mongodb+srv://harshal:CsTg5w0upPnW5Ttq@cluster0.69rkq.mongodb.net/Calender")
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  })
  .catch((error) => console.error("MongoDB connection error:", error))
