import { useState, useEffect } from "react";
import "../components/Todolist.css";
import { Todolist } from "../components/Todolist.jsx";
import {
  fetchTasks as apiFetchTasks, // Используем псевдоним
  removeTask,
  addTask,
  editTask,
  toggleTaskStatus,
} from "../api/todoApi";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await apiFetchTasks(filter); // Используем импортированную функцию
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    loadTasks();
  }, [filter]);

  const handleRemoveTask = async (id) => {
    try {
      await removeTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error removing task:", error);
    }
  };

  const handleAddTask = async (title) => {
    if (!title.trim()) {
      alert("Заголовок обязательное поле");
      return;
    }
    if (title.length < 2 || title.length > 64) {
      alert("Заголовок должен быть от 2 до 64 символов");
      return;
    }

    try {
      const newTask = await addTask(title);
      setTasks((prevTasks) => [newTask, ...prevTasks]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleEditTask = async (id, newTitle) => {
    try {
      const updatedTask = await editTask(id, newTitle);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const handleToggleTaskStatus = async (id) => {
    try {
      const taskToUpdate = tasks.find((task) => task.id === id);
      const updatedTask = await toggleTaskStatus(id, taskToUpdate.isDone);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (error) {
      console.error("Error task status:", error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Completed") return task.isDone;
    if (filter === "Active") return !task.isDone;
    return true;
  });

  const counts = {
    all: tasks.length,
    active: tasks.filter((t) => !t.isDone).length,
    completed: tasks.filter((t) => t.isDone).length,
  };

  return (
    <div className="App">
      <Todolist
        tasks={filteredTasks}
        removeTask={handleRemoveTask}
        changeFilter={setFilter}
        addTask={handleAddTask}
        editTask={handleEditTask}
        toggleTaskStatus={handleToggleTaskStatus}
        allTasksCount={counts.all}
        activeTasksCount={counts.active}
        completedTasksCount={counts.completed}
      />
    </div>
  );
}

export default App;
