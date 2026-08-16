import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaPlus,
  FaTrash,
  FaCheck,
  FaRegPenToSquare,
  FaXmark,
} from "react-icons/fa6";

import "../styles/garage.css";

import {
  addVehicle,
  deleteVehicle,
  subscribeGarage,
} from "../firebase/garage";

import {
  subscribeTasks,
  addTask,
  updateTask,
  deleteTask,
} from "../firebase/tasks";

import { useGroup } from "../auth/GroupProvider";
import { getCampingStyle } from "../campingStyles";

function Garage() {
  const navigate = useNavigate();

  const { groupId, campingStyle } = useGroup();

  const style = getCampingStyle(campingStyle);

  /* ========================================
     VEHICLES
  ======================================== */

  const [showSelector, setShowSelector] = useState(false);
  const [vehicles, setVehicles] = useState([]);

  /* ========================================
     TASKS
  ======================================== */

  const [tasks, setTasks] = useState([]);

  const [showAddTask, setShowAddTask] =
    useState(false);

  const [newTask, setNewTask] = useState("");
  const [newTaskNotes, setNewTaskNotes] =
    useState("");

  const [editingTaskId, setEditingTaskId] =
    useState(null);

  const [editingTaskText, setEditingTaskText] =
    useState("");

  const [editingTaskNotes, setEditingTaskNotes] =
    useState("");

  /* ========================================
     LOAD VEHICLES
  ======================================== */

  useEffect(() => {
    if (!groupId) return undefined;

    return subscribeGarage(
      groupId,
      setVehicles,
      console.error
    );
  }, [groupId]);

  /* ========================================
     LOAD TASKS
  ======================================== */

  useEffect(() => {
    if (!groupId) return undefined;

    return subscribeTasks(
      groupId,
      setTasks,
      console.error
    );
  }, [groupId]);

  /* ========================================
     ADD VEHICLE
  ======================================== */

  async function createVehicle(vehicleType) {
    try {
      await addVehicle(groupId, {
        type: vehicleType.type,
        manufacturer: "",
        model: vehicleType.defaultModel,
        year: "",
        created: Date.now(),
      });

      setShowSelector(false);
    } catch (error) {
      console.error(error);
      alert("Failed to add vehicle.");
    }
  }

  /* ========================================
     DELETE VEHICLE
  ======================================== */

  async function removeVehicle(event, vehicle) {
    event.stopPropagation();

    if (
      !window.confirm(
        `Delete "${
          vehicle.model || vehicle.type
        }"?\n\nThis cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteVehicle(
        groupId,
        vehicle.id
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete vehicle.");
    }
  }

  /* ========================================
     ADD TASK
  ======================================== */

  async function createTask() {
    if (!newTask.trim()) return;

    try {
      await addTask(groupId, {
        text: newTask.trim(),
        notes: newTaskNotes.trim(),
      });

      setNewTask("");
      setNewTaskNotes("");
      setShowAddTask(false);
    } catch (error) {
      console.error(error);
      alert("Failed to add task.");
    }
  }

  /* ========================================
     COMPLETE TASK
  ======================================== */

  async function toggleTask(task) {
    try {
      await updateTask(
        groupId,
        task.id,
        {
          completed: !task.completed,
        }
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update task.");
    }
  }

  /* ========================================
     EDIT TASK
  ======================================== */

  function startTaskEdit(task) {
    setEditingTaskId(task.id);
    setEditingTaskText(task.text);
    setEditingTaskNotes(
      task.notes || ""
    );
  }

  async function saveTaskEdit(taskId) {
    if (!editingTaskText.trim()) return;

    try {
      await updateTask(
        groupId,
        taskId,
        {
          text: editingTaskText.trim(),
          notes: editingTaskNotes.trim(),
        }
      );

      setEditingTaskId(null);
      setEditingTaskText("");
      setEditingTaskNotes("");
    } catch (error) {
      console.error(error);
      alert("Failed to update task.");
    }
  }

  function cancelTaskEdit() {
    setEditingTaskId(null);
    setEditingTaskText("");
    setEditingTaskNotes("");
  }

  /* ========================================
     DELETE TASK
  ======================================== */

  async function removeTask(task) {
    if (
      !window.confirm(
        `Delete "${task.text}"?\n\nThis cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteTask(
        groupId,
        task.id
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete task.");
    }
  }

  /* ========================================
     RENDER
  ======================================== */

  return (
    <div className="garage-page">

      {/* PAGE HEADER */}

      <div className="shopping-title">
        <h1>Garage</h1>

        <p>
          Manage your{" "}
          {style.label.toLowerCase()}{" "}
          vehicles and equipment.
        </p>
      </div>

      {/* ADD VEHICLE */}

      <button
        className="add-checklist-btn"
        onClick={() =>
          setShowSelector(true)
        }
      >
        <FaPlus /> Add Vehicle
      </button>

      {/* VEHICLE SELECTOR */}

      {showSelector && (
        <div className="dashboard-card">

          <h3>
            Select Vehicle Type
          </h3>

          {style.garageTypes.map(
            (vehicleType) => (
              <button
                key={vehicleType.type}
                className="add-checklist-btn"
                onClick={() =>
                  createVehicle(
                    vehicleType
                  )
                }
              >
                {vehicleType.icon}{" "}
                {vehicleType.type}
              </button>
            )
          )}

          <button
            className="untick"
            onClick={() =>
              setShowSelector(false)
            }
          >
            Cancel
          </button>

        </div>
      )}

      {/* VEHICLES */}

      {vehicles.length === 0 ? (

        <div className="dashboard-card">
          <h3>
            No vehicles added yet
          </h3>

          <p>
            Tap “Add Vehicle” to get started.
          </p>
        </div>

      ) : (

        vehicles.map((vehicle) => {

          const type =
            style.garageTypes.find(
              (item) =>
                item.type ===
                vehicle.type
            );

          return (
            <div
              key={vehicle.id}
              className="dashboard-card"
              onClick={() =>
                navigate(
                  `/garage/${vehicle.id}`
                )
              }
              style={{
                cursor: "pointer",
              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >

                <span
                  style={{
                    fontSize: "24px",
                  }}
                >
                  {type?.icon || "🚗"}
                </span>

                <div
                  style={{
                    flex: 1,
                  }}
                >

                  <h3>
                    {vehicle.manufacturer ||
                      "Unknown Manufacturer"}
                  </h3>

                  <p
                    style={{
                      margin: "2px 0",
                    }}
                  >
                    {vehicle.model ||
                      "Unnamed Vehicle"}
                  </p>

                  {vehicle.registration && (
                    <p
                      style={{
                        margin: "2px 0",
                        fontSize: "14px",
                      }}
                    >
                      {vehicle.registration}
                    </p>
                  )}

                </div>

                <button
                  className="delete-btn"
                  onClick={(event) =>
                    removeVehicle(
                      event,
                      vehicle
                    )
                  }
                  aria-label={`Delete ${
                    vehicle.model ||
                    vehicle.type
                  }`}
                >
                  <FaTrash />
                </button>

              </div>

            </div>
          );
        })

      )}

      {/* ========================================
          TO DO & UPGRADES
      ======================================== */}

      <div className="garage-tasks">

        <div className="garage-tasks-header">

          <div>
            <h2>
              🔧 To Do & Upgrades
            </h2>

            <p>
              Things to fix, add or upgrade.
            </p>
          </div>

          <button
            className="garage-add-task-btn"
            onClick={() =>
              setShowAddTask(true)
            }
          >
            <FaPlus />
          </button>

        </div>

        {/* ADD TASK FORM */}

        {showAddTask && (

          <div className="garage-task-form">

            <input
              type="text"
              placeholder="What needs doing?"
              value={newTask}
              onChange={(event) =>
                setNewTask(
                  event.target.value
                )
              }
              autoFocus
            />

            <textarea
              placeholder="Notes (optional)"
              value={newTaskNotes}
              onChange={(event) =>
                setNewTaskNotes(
                  event.target.value
                )
              }
            />

            <div className="garage-task-form-buttons">

              <button
                className="task-save-btn"
                onClick={createTask}
              >
                <FaCheck /> Save
              </button>

              <button
                className="task-cancel-btn"
                onClick={() => {
                  setNewTask("");
                  setNewTaskNotes("");
                  setShowAddTask(false);
                }}
              >
                <FaXmark /> Cancel
              </button>

            </div>

          </div>
        )}

        {/* NO TASKS */}

        {tasks.length === 0 &&
!showAddTask ? (

  <div className="garage-no-tasks">
    <p>
      No tasks or upgrades yet.
    </p>
  </div>

) : (

          /* TASK LIST */

          <div className="garage-task-list">

            {tasks.map((task) => (

              <div
                key={task.id}
                className={`garage-task ${
                  task.completed
                    ? "completed"
                    : ""
                }`}
              >

                {editingTaskId ===
                task.id ? (

                  /* EDIT TASK */

                  <div className="garage-task-edit">

                    <input
                      value={editingTaskText}
                      onChange={(event) =>
                        setEditingTaskText(
                          event.target.value
                        )
                      }
                    />

                    <textarea
                      value={editingTaskNotes}
                      onChange={(event) =>
                        setEditingTaskNotes(
                          event.target.value
                        )
                      }
                    />

                    <div className="garage-task-actions">

                      <button
                        className="task-save-btn"
                        onClick={() =>
                          saveTaskEdit(
                            task.id
                          )
                        }
                      >
                        <FaCheck />
                      </button>

                      <button
                        className="task-cancel-btn"
                        onClick={
                          cancelTaskEdit
                        }
                      >
                        <FaXmark />
                      </button>

                    </div>

                  </div>

                ) : (

                  /* NORMAL TASK */

                  <>
                    <label className="garage-task-main">

                      <input
                        type="checkbox"
                        checked={
                          task.completed
                        }
                        onChange={() =>
                          toggleTask(task)
                        }
                      />

                      <div>

                        <strong>
                          {task.text}
                        </strong>

                        {task.notes && (
                          <p>
                            {task.notes}
                          </p>
                        )}

                      </div>

                    </label>

                    <div className="garage-task-actions">

                      <button
                        className="edit-btn"
                        onClick={() =>
                          startTaskEdit(
                            task
                          )
                        }
                        aria-label={`Edit ${
                          task.text
                        }`}
                      >
                        <FaRegPenToSquare />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          removeTask(
                            task
                          )
                        }
                        aria-label={`Delete ${
                          task.text
                        }`}
                      >
                        <FaTrash />
                      </button>

                    </div>
                  </>

                )}

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Garage;