import React, { useState, useEffect } from "react";
import { Card } from "antd";
import { fetchTasks } from "../../api/todoapi";
import { CreateTodo } from "../../components/CreateTodo/CreateTodo";
import { Filters } from "../../components/Filters/Filters";
import { TodoList } from "../../components/TodoList/Todolist";
import { ApiResponse, FilterStatus } from "../../types.ts/Todot";
import styles from "./TodoPage.module.css";

export const TodoPage: React.FC = () => {
  const [tasks, setTasks] = useState<ApiResponse["data"]>([]);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [counts, setCounts] = useState<ApiResponse["info"]>({
    all: 0,
    inWork: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchTasks(filter);
      setTasks(data.data);
      setCounts(data.info);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let intervalId: number | undefined;

    const startInterval = () => {
      if (intervalId) {
        clearInterval(intervalId);
      }

      intervalId = window.setInterval(() => {
        loadTasks();
      }, 5000);
    };

    loadTasks();

    startInterval();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [filter]);

  return (
    <div className={styles.container}>
      <Card loading={loading} title="Список задач">
        <CreateTodo onUpdateTodos={loadTasks} />
        <Filters filter={filter} onChangeFilter={setFilter} counts={counts} />
        <TodoList tasks={tasks} onUpdateTodos={loadTasks} />
      </Card>
    </div>
  );
};
