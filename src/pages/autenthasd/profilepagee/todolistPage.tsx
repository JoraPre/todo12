import React, { useState, useEffect } from "react";
import { message } from "antd";
import { useSearchParams } from "react-router-dom";

import TaskAdd from "../../../components/taskAdd/taslAdd.tsx";
import TodoList from "../../../components/todoList/taskList.tsx";

import { getTasks } from "../../../Api/apiclone1.tsx";
import type { Todo, TodoInfo, TaskCategory } from "../../../types/type.tsx";

const TIMEOUT = 5000;

export const TodoListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState<TaskCategory>(() => {
    const urlCategory = searchParams.get("category") as TaskCategory;
    const savedCategory = localStorage.getItem("taskCategory") as TaskCategory;
    return urlCategory || savedCategory || "all";
  });

  const [tasks, setTasks] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoInfo>({
    all: 0,
    inWork: 0,
    completed: 0,
  });
  const [messageApi, contextHolder] = message.useMessage();

  const fetchTasks = async () => {
    try {
      const response = await getTasks(category);
      setTasks(response.data);
      setFilter(response.info);
    } catch (error) {
      console.error(error);
      messageApi.error("Не удалось загрузить задачи. Попробуйте снова.");
    }
  };

  const updateCategory = (newCategory: TaskCategory) => {
    setCategory(newCategory);

    setSearchParams({ category: newCategory });

    localStorage.setItem("taskCategory", newCategory);
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, TIMEOUT);
    return () => clearInterval(interval);
  }, [category]);

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
