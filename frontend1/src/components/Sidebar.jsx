"use client"
import { useSelector, useDispatch } from "react-redux"
import { openModal } from "../redux/slices/uiSlice"
import "./Sidebar.css"

const Sidebar = () => {
  const dispatch = useDispatch()
  const { goals } = useSelector((state) => state.goals)

  // Group goals by category
  const groupedGoals = goals.reduce((acc, goal) => {
    const { category } = goal
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(goal)
    return acc
  }, {})

  // Handle drag start for goals
  const handleDragStart = (e, goal) => {
    e.dataTransfer.setData("goalId", goal._id)
    e.dataTransfer.setData("goalName", goal.name)
    e.dataTransfer.setData("goalColor", goal.color)
    e.dataTransfer.setData("goalCategory", goal.category)
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Goals</h2>
      </div>

      <div className="sidebar-content">
        {Object.entries(groupedGoals).map(([category, categoryGoals]) => (
          <div key={category} className="goal-category">
            <h3>{category}</h3>
            <ul className="goal-list">
              {categoryGoals.map((goal) => (
                <li
                  key={goal._id}
                  className="goal-item"
                  draggable
                  onDragStart={(e) => handleDragStart(e, goal)}
                  style={{ borderLeftColor: goal.color }}
                >
                  {goal.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="add-goal-button" onClick={() => dispatch(openModal({ type: "createGoal" }))}>
          + Add Goal
        </button>
      </div>
    </div>
  )
}

export default Sidebar
