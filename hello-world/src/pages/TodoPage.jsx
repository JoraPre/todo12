import { useState, useEffect } from "react";
import { CreateTodo } from "../components/CreateTodo";
import { Filters } from "../components/Filters";
import { TodoList } from "../components/TodoList";
import {
  fetchTasks as apiFetchTasks,
  removeTask,
  addTask,
  editTask,
  toggleTaskStatus,
} from "../api/todoApi";

export function TodoPage() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await apiFetchTasks(filter);
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    loadTasks();
  }, [filter]);

  const handleAdd = async (title) => {
    try {
      await addTask(title);
      const data = await apiFetchTasks(filter);
      setTasks(data);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeTask(id);
      const data = await apiFetchTasks(filter);
      setTasks(data);
    } catch (error) {
      console.error("Error removing task:", error);
    }
  };

  const handleEdit = async (id, newTitle) => {
    try {
      await editTask(id, newTitle);
      const data = await apiFetchTasks(filter);
      setTasks(data);
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const handleToggle = async (id) => {
    try {
      const taskToUpdate = tasks.find((task) => task.id === id);
      await toggleTaskStatus(id, taskToUpdate.isDone);
      const data = await apiFetchTasks(filter);
      setTasks(data);
    } catch (error) {
      console.error("Error toggling task status:", error);
    }
  };

  const counts = {
    all: tasks.length,
    active: tasks.filter((t) => !t.isDone).length,
    completed: tasks.filter((t) => t.isDone).length,
  };

  return (
    <div className="todolist">
      <CreateTodo onAdd={handleAdd} />
      <Filters filter={filter} onChangeFilter={setFilter} counts={counts} />
      <TodoList
        tasks={tasks}
        onRemove={handleRemove}
        onEdit={handleEdit}
        onToggle={handleToggle}
      />
    </div>
  );
}
