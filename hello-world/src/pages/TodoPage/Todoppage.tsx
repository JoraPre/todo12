import React, { useState, useEffect } from "react";
import styles from "./TodoPage.module.css";
import { CreateTodo } from "../../components/CreateTodo/CreateTodo.tsx";
import { Filters, FilterStatus } from "../../components/Filters/Filters.tsx";
import { TodoList } from "../../components/TodoList/Todolist.tsx";
import { fetchTasks, ApiResponse } from "../../api/todoapi.tsx";

export const TodoPage: React.FC = () => {
  const [tasks, setTasks] = useState<ApiResponse["data"]>([]);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [counts, setCounts] = useState<ApiResponse["info"]>({
    all: 0,
    inWork: 0,
    completed: 0,
  });

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
};
