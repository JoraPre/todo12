import React, { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { useSearchParams } from "react-router-dom";

import TaskAdd from "../../components/taskAdd/TaskAdd";
import TodoList from "../../components/todoList/TodoList";
import { getTasks } from "../../api/api";
import type { Todo, TodoInfo, TaskCategory } from "../../types/todo";

const TIMEOUT = 5000;
const VALID_CATEGORIES: TaskCategory[] = ["all", "inWork", "completed"];

const isValidCategory = (value: string | null): value is TaskCategory =>
  VALID_CATEGORIES.includes(value as TaskCategory);

export const TodoListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [messageApi, contextHolder] = message.useMessage();

  const [category, setCategory] = useState<TaskCategory>(() => {
    const urlCategory = searchParams.get("category");
    const savedCategory = localStorage.getItem("taskCategory");
    if (isValidCategory(urlCategory)) return urlCategory;
    if (isValidCategory(savedCategory)) return savedCategory;
    return "all";
  });

  const [tasks, setTasks] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoInfo>({
    all: 0,
    inWork: 0,
    completed: 0,
  });

  const fetchTasks = useCallback(async () => {
    try {
      const response = await getTasks(category);
      setTasks(response.data);
      setFilter(response.info);
    } catch (error) {
      console.error(error);
      messageApi.error("Не удалось загрузить задачи. Попробуйте снова.");
    }
  }, [category, messageApi]);

  const updateCategory = (newCategory: TaskCategory) => {
    setCategory(newCategory);
    setSearchParams({ category: newCategory });
    localStorage.setItem("taskCategory", newCategory);
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, TIMEOUT);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  return (
    <>
      {contextHolder}
      <TaskAdd updateTasks={fetchTasks} />
      <TodoList
        tasks={tasks}
        filter={filter}
        category={category}
        updateTasks={updateCategory}
        fetchTasks={fetchTasks}
      />
    </>
  );
};
