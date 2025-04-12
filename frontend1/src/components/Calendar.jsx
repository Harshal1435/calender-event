"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { format, startOfWeek, addDays, isSameDay } from "date-fns"
import { openModal } from "../redux/slices/uiSlice"
import { updateEvent } from "../redux/slices/eventSlice"
import EventItem from "./EventItem"
import EventModal from "./EventModal"
import "./Calendar.css"

const Calendar = () => {
  const dispatch = useDispatch()
  const { events } = useSelector((state) => state.events)
  const { currentDate, isModalOpen } = useSelector((state) => state.ui)
  const [weekDays, setWeekDays] = useState([])
  const [timeSlots, setTimeSlots] = useState([])

  // Generate week days
  useEffect(() => {
    const days = []
    const start = startOfWeek(currentDate, { weekStartsOn: 1 })

    for (let i = 0; i < 7; i++) {
      const day = addDays(start, i)
      days.push(day)
    }

    setWeekDays(days)
  }, [currentDate])

  // Generate time slots
  useEffect(() => {
    const slots = []
    for (let i = 6; i < 24; i++) {
      slots.push(`${i}:00`)
    }
    setTimeSlots(slots)
  }, [])

  // Handle click on calendar cell to create new event
  const handleCellClick = (day, time) => {
    const [hours] = time.split(":").map(Number)
    const startTime = new Date(day)
    startTime.setHours(hours, 0, 0, 0)

    const endTime = new Date(startTime)
    endTime.setHours(hours + 1, 0, 0, 0)

    dispatch(
      openModal({
        type: "create",
        data: { start: startTime, end: endTime },
      }),
    )
  }

  // Handle drag and drop
  const handleDragStart = (e, eventId) => {
    e.dataTransfer.setData("eventId", eventId)
  }

  const handleDrop = (e, day, time) => {
    e.preventDefault()
    const eventId = e.dataTransfer.getData("eventId")
    const eventToUpdate = events.find((event) => event._id === eventId)

    if (eventToUpdate) {
      const [hours, minutes] = time.split(":").map(Number)

      // Calculate the duration of the original event
      const originalStart = new Date(eventToUpdate.start)
      const originalEnd = new Date(eventToUpdate.end)
      const duration = originalEnd.getTime() - originalStart.getTime()

      // Create new start time
      const newStart = new Date(day)
      newStart.setHours(hours, minutes || 0, 0, 0)

      // Create new end time based on the original duration
      const newEnd = new Date(newStart.getTime() + duration)

      dispatch(
        updateEvent({
          id: eventId,
          event: { ...eventToUpdate, start: newStart, end: newEnd },
        }),
      )
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  // Filter events for a specific day and time
  const getEventsForTimeSlot = (day, time) => {
    const [hours] = time.split(":").map(Number)
    const slotStart = new Date(day)
    slotStart.setHours(hours, 0, 0, 0)

    const slotEnd = new Date(day)
    slotEnd.setHours(hours + 1, 0, 0, 0)

    return events.filter((event) => {
      // Ensure event.start and event.end are Date objects
      const eventStart = event.start instanceof Date ? event.start : new Date(event.start)
      const eventEnd = event.end instanceof Date ? event.end : new Date(event.end)

      return isSameDay(eventStart, day) && eventStart.getHours() <= hours && eventEnd.getHours() > hours
    })
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
        <div className="time-column"></div>
        {weekDays.map((day, index) => (
          <div key={index} className="day-column">
            <div className="day-header">
              <div className="day-name">{format(day, "EEE")}</div>
              <div className="day-number">{format(day, "d")}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="calendar-body">
        <div className="time-column">
          {timeSlots.map((time, index) => (
            <div key={index} className="time-slot">
              <span>{time}</span>
            </div>
          ))}
        </div>

        {weekDays.map((day, dayIndex) => (
          <div key={dayIndex} className="day-column">
            {timeSlots.map((time, timeIndex) => {
              const eventsInSlot = getEventsForTimeSlot(day, time)

              return (
                <div
                  key={timeIndex}
                  className="time-cell"
                  onClick={() => handleCellClick(day, time)}
                  onDrop={(e) => handleDrop(e, day, time)}
                  onDragOver={handleDragOver}
                >
                  {eventsInSlot.map((event) => (
                    <EventItem
                      key={event._id || `temp-${event.title}`}
                      event={event}
                      onDragStart={(e) => handleDragStart(e, event._id)}
                    />
                  ))}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {isModalOpen && <EventModal />}
    </div>
  )
}

export default Calendar
