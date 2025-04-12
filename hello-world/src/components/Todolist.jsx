// src/components/TodoList.jsx
import React from "react";
import { TodoItem } from "./TodoItem";
import "./Todolist.css";

export const TodoList = ({ tasks, onRemove, onEdit, onToggle }) => {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TodoItem
          key={task.id}
          task={task}
          onRemove={onRemove}
          onEdit={onEdit}
          onToggle={onToggle}
        />
      ))}
    </ul>
  );
};
