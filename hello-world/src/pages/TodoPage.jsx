// src/pages/TodoPage.jsx
import { useState, useEffect } from "react";
import { CreateTodo } from "../components/CreateTodo";
import { Filters } from "../components/Filters";
import { TodoList } from "../components/Todolist.jsx";
import {
  fetchTasks,
  removeTask,
  addTask,
  editTask,
  toggleTaskStatus,
} from "../api/todoApi";

export function TodoPage() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [counts, setCounts] = useState({ all: 0, inWork: 0, completed: 0 });

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks(filter);
        setTasks(data.data);
        setCounts(data.info);
      } catch (error) {
        alert("Ошибка при загрузке задач");
      }
    };
    loadTasks();
  }, [filter]);

  const handleAdd = async (title) => {
    try {
      const newTask = await addTask(title);
      setTasks((prev) => [...prev, newTask]);
      setCounts((prev) => ({
        ...prev,
        all: prev.all + 1,
        inWork: prev.inWork + 1,
      }));
    } catch (error) {
      alert("Ошибка при добавлении задачи");
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeTask(id);
      const removedTask = tasks.find((t) => t.id === id);
      setTasks(tasks.filter((t) => t.id !== id));
      setCounts((prev) => ({
        ...prev,
        all: prev.all - 1,
        inWork: prev.inWork - (removedTask.isDone ? 0 : 1),
        completed: prev.completed - (removedTask.isDone ? 1 : 0),
      }));
    } catch (error) {
      alert("Ошибка при удалении задачи");
    }
  };

  const handleEdit = async (id, newTitle) => {
    try {
      const updatedTask = await editTask(id, newTitle);
      setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
    } catch (error) {
      alert("Ошибка при редактировании задачи");
    }
  };

  const handleToggle = async (id) => {
    try {
      const task = tasks.find((t) => t.id === id);
      const updatedTask = await toggleTaskStatus(id, !task.isDone);
      setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
      setCounts((prev) => ({
        ...prev,
        inWork: prev.inWork + (task.isDone ? 1 : -1),
        completed: prev.completed + (task.isDone ? -1 : 1),
      }));
    } catch (error) {
      alert("Ошибка при изменении статуса задачи");
    }
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
