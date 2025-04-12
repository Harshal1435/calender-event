"use client"
import { useDispatch } from "react-redux"
import { format } from "date-fns"
import { openModal } from "../redux/slices/uiSlice"
import "./EventItem.css"

const EventItem = ({ event, onDragStart }) => {
  const dispatch = useDispatch()

  const handleClick = (e) => {
    e.stopPropagation()
    dispatch(openModal({ type: "edit", data: event }))
  }

  // Calculate height based on duration
  const calculateHeight = () => {
    const start = new Date(event.start)
    const end = new Date(event.end)
    const durationInMinutes = (end - start) / (1000 * 60)

    // Each hour is 60px height
    return (durationInMinutes / 60) * 60
  }

  // Calculate top position based on start time minutes
  const calculateTop = () => {
    const start = new Date(event.start)
    const minutes = start.getMinutes()

    // Each minute is 1px from the top of the hour
    return minutes
  }

  const eventStyle = {
    backgroundColor: event.color || getCategoryColor(event.category),
    height: `${calculateHeight()}px`,
    top: `${calculateTop()}px`,
  }

  return (
    <div className="event-item" style={eventStyle} onClick={handleClick} draggable onDragStart={onDragStart}>
      <div className="event-time">
        {format(new Date(event.start), "h:mm a")} - {format(new Date(event.end), "h:mm a")}
      </div>
      <div className="event-title">{event.title}</div>
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

export default EventItem
