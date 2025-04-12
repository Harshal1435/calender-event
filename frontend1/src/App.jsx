"use client"
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchEvents } from "./redux/slices/eventSlice"
import { fetchGoals } from "./redux/slices/goalSlice"
import Calendar from "./components/Calendar"
import Sidebar from "./components/Sidebar"
import GoalModal from "./components/GoalModal"
import "./App.css"

const App = () => {
  const dispatch = useDispatch()
  const { isModalOpen, modalType } = useSelector((state) => state.ui)

  useEffect(() => {
    dispatch(fetchEvents())
    dispatch(fetchGoals())
  }, [dispatch])

  return (
    <div className="app">
      <Sidebar />
      <Calendar />

      {isModalOpen && modalType === "createGoal" && <GoalModal />}
    </div>
  )
}

export default App
