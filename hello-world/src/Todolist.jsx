import { useState, useEffect } from "react";

export function Todolist({
  tasks,
  removeTask,
  changeFilter,
  addTask,
  editTask,
  toggleTaskStatus,
}) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [activeButton, setActiveButton] = useState("All");

  useEffect(() => {
    if (editingTaskId && !tasks.some((t) => t.id === editingTaskId)) {
      setEditingTaskId(null);
      setNewTaskTitle("");
    }
  }, [tasks, editingTaskId]);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      alert("Заголовок обязательное поле");
      return;
    }
    if (newTaskTitle.length < 2 || newTaskTitle.length > 64) {
      alert("Заголовок должен быть от 2 до 64 символов");
      return;
    }
    addTask(newTaskTitle);
    setNewTaskTitle("");
  };

  const handleStartEdit = (id, title) => {
    setEditingTaskId(id);
    setNewTaskTitle(title);
  };

  const handleSaveEdit = (id) => {
    editTask(id, newTaskTitle);
    setEditingTaskId(null);
    setNewTaskTitle("");
  };

  const allTasksCount = tasks.length;
  const activeTasksCount = tasks.filter((t) => !t.isDone).length;
  const completedTasksCount = tasks.filter((t) => t.isDone).length;

  return (
    <div className="todolist">
      <div className="add-task">
        <input
          placeholder="Task To Be Done"
          className="input-edit"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button className="btn-add" onClick={handleAddTask}>
          Add
        </button>
      </div>
      <div className="filters">
        <button
          className="ball"
          onClick={() => {
            changeFilter("All");
            setActiveButton("All");
          }}
        >
          Все ({allTasksCount})
        </button>
        <button className="bactive" onClick={() => changeFilter("Active")}>
          В работе ({activeTasksCount})
        </button>
        <button
          className="bcompleted"
          onClick={() => changeFilter("Completed")}
        >
          Выполнено ({completedTasksCount})
        </button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            {editingTaskId === task.id ? (
              <div className="edit-mode">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <button onClick={() => handleSaveEdit(task.id)}>Save</button>
                <button onClick={() => setEditingTaskId(null)}>Cancel</button>
              </div>
            ) : (
              <div className="view-mode">
                <label className="checkbox-container">
                  <input
                    className="checkbox-input"
                    type="checkbox"
                    checked={task.isDone}
                    onChange={() => toggleTaskStatus(task.id)}
                  />
                  <span className="checkmark"></span>
                  <span
                    style={{
                      textDecoration: task.isDone ? "line-through" : "none",
                      color: task.isDone ? "#808080" : "inherit",
                    }}
                    className="task-title"
                  >
                    {task.title}
                  </span>
                </label>
                <div className="actions">
                  <button
                    className="btn-delete"
                    onClick={() => removeTask(task.id)}
                  ></button>
                  <button
                    className="btn-edit"
                    onClick={() => handleStartEdit(task.id, task.title)}
                  ></button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
