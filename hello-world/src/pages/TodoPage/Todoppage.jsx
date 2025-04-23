import React, { useState, useEffect } from "react";
import styles from "./TodoPage.module.css";
import { CreateTodo } from "../../components/CreateTodo/CreateTodo";
import { Filters } from "../../components/Filters/Filters";
import { TodoList } from "../../components/TodoList/Todolist";
import { fetchTasks } from "../../api/todoapi";

export function TodoPage() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [counts, setCounts] = useState({ all: 0, inWork: 0, completed: 0 });

  const loadTasks = async () => {
    try {
      const data = await fetchTasks(filter);
      setTasks(data.data);
      setCounts(data.info);
    } catch (error) {
      alert("Ошибка при загрузке задач");
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filter]);

  return (
    <div className={styles.container}>
      <CreateTodo onUpdateTodos={loadTasks} />
      <Filters filter={filter} onChangeFilter={setFilter} counts={counts} />
      <TodoList tasks={tasks} onUpdateTodos={loadTasks} />
    </div>
  );
}
