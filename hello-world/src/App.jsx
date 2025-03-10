import { useState, useEffect } from "react";
import "./App.css";
import { Todolist } from "./Todolist";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async (status = "All") => {
    try {
      const response = await fetch(
        `https://easydev.club/api/v1/todos?filter=${status}`
      );
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const removeTask = async (id) => {
    try {
      await fetch(`https://easydev.club/api/v1/todos/${id}`, {
        method: "DELETE",
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error removing task:", error);
    }
  };

  const addTask = async (title) => {
    try {
      const response = await fetch("https://easydev.club/api/v1/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, isDone: false }),
      });
      if (!response.ok) throw new Error("Failed to add task");
      const newTask = await response.json();
      setTasks((prevTasks) => [newTask, ...prevTasks]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
    if (!title.trim()) {
      alert("Заголовок обязательное поле");
      return;
    }
    if (title.length < 2 || title.length > 64) {
      alert("Заголовок должен быть от 2 до 64 символов");
      return;
    }
  };

  const editTask = async (id, newTitle) => {
    try {
      const response = await fetch(`https://easydev.club/api/v1/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
      if (!response.ok) throw new Error("Failed to edit task");
      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const toggleTaskStatus = async (id) => {
    try {
      const taskToUpdate = tasks.find((task) => task.id === id);
      const updatedIsDone = !taskToUpdate.isDone;

      const response = await fetch(`https://easydev.club/api/v1/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDone: updatedIsDone }),
      });
      if (!response.ok) throw new Error("Failed to update task status");
      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (error) {
      console.error("Error task status:", error);
    }
  };

  const changeFilter = (value) => {
    setFilter(value);
    fetchTasks(value);
  };

  let tasksForTodolist = tasks;
  if (filter === "Complited") {
    tasksForTodolist = tasks.filter((t) => t.isDone === true);
  }
  if (filter === "Active") {
    tasksForTodolist = tasks.filter((t) => t.isDone === false);
  }

  return (
    <div className="App">
      <Todolist
        tasks={tasksForTodolist}
        removeTask={removeTask}
        changeFilter={changeFilter}
        addTask={addTask}
        editTask={editTask}
        setTasks={setTasks}
        toggleTaskStatus={toggleTaskStatus}
      />
    </div>
  );
}

export default App;
