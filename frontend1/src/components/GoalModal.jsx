"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { closeModal } from "../redux/slices/uiSlice"
import { createGoal } from "../redux/slices/goalSlice"
import "./EventModal.css" // Reuse the same styles

const GoalModal = () => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: "",
    category: "Learn",
    color: "#2196F3",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(createGoal(formData))
    dispatch(closeModal())
  }

  return (
    <div className="modal-overlay">
      <div className="event-modal">
        <div className="modal-header">
          <h2>Create New Goal</h2>
          <button className="close-button" onClick={() => dispatch(closeModal())}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Goal Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Goal name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={formData.category} onChange={handleChange} required>
              <option value="Academics">Academics</option>
              <option value="Learn">Learn</option>
              <option value="Sports">Sports</option>
              <option value="ML">ML</option>
              <option value="AI">AI</option>
              <option value="DE">DE</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="color">Color</label>
            <input type="color" id="color" name="color" value={formData.color} onChange={handleChange} required />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={() => dispatch(closeModal())}>
              Cancel
            </button>
            <button type="submit" className="save-button">
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GoalModal
