import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import * as api from "../../api/index.js"


export const fetchEvents = createAsyncThunk("events/fetchEvents", async () => {
  const response = await api.fetchEvents()
  return response.data
})

export const createEvent = createAsyncThunk("events/createEvent", async (event) => {
  const response = await api.createEvent(event)
  return response.data
})

export const updateEvent = createAsyncThunk("events/updateEvent", async ({ id, event }) => {
  const response = await api.updateEvent(id, event)
  return response.data
})

export const deleteEvent = createAsyncThunk("events/deleteEvent", async (id) => {
  await api.deleteEvent(id)
  return id
})

const eventSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.events = action.payload
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload)
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex((event) => event._id === action.payload._id)
        if (index !== -1) {
          state.events[index] = action.payload
        }
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((event) => event._id !== action.payload)
      })
  },
})

export default eventSlice.reducer
