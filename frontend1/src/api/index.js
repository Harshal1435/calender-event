import axios from "axios"

const API = axios.create({ baseURL: "http://localhost:5000/api" })

// Event API calls
export const fetchEvents = () => API.get("/events")
export const createEvent = (newEvent) => API.post("/events", newEvent)
export const updateEvent = (id, updatedEvent) => API.put(`/events/${id}`, updatedEvent)
export const deleteEvent = (id) => API.delete(`/events/${id}`)

// Goal API calls
export const fetchGoals = () => API.get("/goals")
export const createGoal = (newGoal) => API.post("/goals", newGoal)
export const updateGoal = (id, updatedGoal) => API.put(`/goals/${id}`, updatedGoal)
export const deleteGoal = (id) => API.delete(`/goals/${id}`)
