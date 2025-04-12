import { createSlice } from "@reduxjs/toolkit"

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isModalOpen: false,
    modalType: null,
    modalData: null,
    currentDate: new Date(),
    view: "week",
  },
  reducers: {
    openModal: (state, action) => {
      state.isModalOpen = true
      state.modalType = action.payload.type
      state.modalData = action.payload.data || null
    },
    closeModal: (state) => {
      state.isModalOpen = false
      state.modalType = null
      state.modalData = null
    },
    setCurrentDate: (state, action) => {
      state.currentDate = action.payload
    },
    setView: (state, action) => {
      state.view = action.payload
    },
  },
})

export const { openModal, closeModal, setCurrentDate, setView } = uiSlice.actions

export default uiSlice.reducer
