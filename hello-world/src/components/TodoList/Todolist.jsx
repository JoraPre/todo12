import React from "react";
import { TodoItem } from "../TodoItem/TodoItem";
import styles from "./TodoList.module.css";

export const TodoList = ({ tasks, onUpdateTodos }) => {
  return (
    <ul className={styles.taskList}>
      {tasks.map((task) => (
        <TodoItem key={task.id} task={task} onUpdateTodos={onUpdateTodos} />
      ))}
    </ul>
  );
};
