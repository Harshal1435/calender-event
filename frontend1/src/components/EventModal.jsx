"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { format } from "date-fns"
import { closeModal } from "../redux/slices/uiSlice"
import { createEvent, updateEvent, deleteEvent } from "../redux/slices/eventSlice"
import "./EventModal.css"

const EventModal = () => {
  const dispatch = useDispatch()
  const { modalType, modalData } = useSelector((state) => state.ui)
  const { goals } = useSelector((state) => state.goals)

  const [formData, setFormData] = useState({
    title: "",
    category: "work",
    start: new Date(),
    end: new Date(new Date().setHours(new Date().getHours() + 1)),
    relatedGoal: "",
  })

  useEffect(() => {
    if (modalData) {
      setFormData({
        ...modalData,
        start: new Date(modalData.start),
        end: new Date(modalData.end),
      })
    }
  }, [modalData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleDateChange = (e) => {
    const { name, value } = e.target
    const [date, time] = value.split("T")

    if (name === "start") {
      const newStart = new Date(date + "T" + time)
      setFormData({
        ...formData,
        start: newStart,
        end: new Date(newStart.getTime() + 60 * 60 * 1000), // Add 1 hour
      })
    } else {
      setFormData({ ...formData, [name]: new Date(date + "T" + time) })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Get color from category or related goal
    let color
    if (formData.relatedGoal) {
      const goal = goals.find((g) => g._id === formData.relatedGoal)
      if (goal) {
        color = goal.color
      }
    } else {
      color = getCategoryColor(formData.category)
    }

    const eventData = {
      ...formData,
      color,
      start: formData.start.toISOString(), // ✅ convert to serializable string
      end: formData.end.toISOString(),     // ✅ convert to serializable string
    }

    if (modalType === "create") {
      dispatch(createEvent(eventData))
    } else if (modalType === "edit") {
      dispatch(updateEvent({ id: modalData._id, event: eventData }))
    }

    dispatch(closeModal())
  }

  const handleDelete = () => {
    if (modalData && modalData._id) {
      dispatch(deleteEvent(modalData._id))
      dispatch(closeModal())
    }
  }

  const formatDateForInput = (date) => {
    return format(date, "yyyy-MM-dd'T'HH:mm")
  }

  return (
    <div className="modal-overlay">
      <div className="event-modal">
        <div className="modal-header">
          <h2>{modalType === "create" ? "Create New Event" : "Edit Event"}</h2>
          <button className="close-button" onClick={() => dispatch(closeModal())}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Event title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={formData.category} onChange={handleChange} required>
              <option value="exercise">Exercise</option>
              <option value="eating">Eating</option>
              <option value="work">Work</option>
              <option value="relax">Relax</option>
              <option value="family">Family</option>
              <option value="social">Social</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="start">Start Time</label>
            <input
              type="datetime-local"
              id="start"
              name="start"
              value={formatDateForInput(formData.start)}
              onChange={handleDateChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="end">End Time</label>
            <input
              type="datetime-local"
              id="end"
              name="end"
              value={formatDateForInput(formData.end)}
              onChange={handleDateChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="relatedGoal">Related Goal (Optional)</label>
            <select id="relatedGoal" name="relatedGoal" value={formData.relatedGoal || ""} onChange={handleChange}>
              <option value="">None</option>
              {goals.map((goal) => (
                <option key={goal._id} value={goal._id}>
                  {goal.name}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            {modalType === "edit" && (
              <button type="button" className="delete-button" onClick={handleDelete}>
                Delete
              </button>
            )}
            <button type="button" className="cancel-button" onClick={() => dispatch(closeModal())}>
              Cancel
            </button>
            <button type="submit" className="save-button">
              {modalType === "create" ? "Create Event" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Helper function to get color based on category
const getCategoryColor = (category) => {
  const colors = {
    exercise: "#4CAF50",
    eating: "#FF9800",
    work: "#2196F3",
    relax: "#9C27B0",
    family: "#E91E63",
    social: "#00BCD4",
  }

  return colors[category] || "#757575"
}

export default EventModal
