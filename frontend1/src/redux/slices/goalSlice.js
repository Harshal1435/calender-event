import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import * as api from "../../api"

export const fetchGoals = createAsyncThunk("goals/fetchGoals", async () => {
  const response = await api.fetchGoals()
  return response.data
})

export const createGoal = createAsyncThunk("goals/createGoal", async (goal) => {
  const response = await api.createGoal(goal)
  return response.data
})

export const updateGoal = createAsyncThunk("goals/updateGoal", async ({ id, goal }) => {
  const response = await api.updateGoal(id, goal)
  return response.data
})

export const deleteGoal = createAsyncThunk("goals/deleteGoal", async (id) => {
  await api.deleteGoal(id)
  return id
})

const goalSlice = createSlice({
  name: "goals",
  initialState: {
    goals: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.goals = action.payload
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.goals.push(action.payload)
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        const index = state.goals.findIndex((goal) => goal._id === action.payload._id)
        if (index !== -1) {
          state.goals[index] = action.payload
        }
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter((goal) => goal._id !== action.payload)
      })
  },
})

export default goalSlice.reducer
