import React, { useState } from "react";
import styles from "./TodoItem.module.css";
import {
  Task,
  toggleTaskStatus,
  editTask,
  removeTask,
} from "../../api/todoapi";

export type TodoItemProps = {
  task: Task;
  onUpdateTodos: () => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({ task, onUpdateTodos }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);

  const handleDelete = async () => {
    try {
      await removeTask(task.id);
      onUpdateTodos();
    } catch (error) {
      alert("Ошибка при удалении задачи");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const title = newTitle.trim();
      if (!title) throw new Error("Заголовок обязательное поле");
      if (title.length < 2 || title.length > 64)
        throw new Error("Заголовок должен быть от 2 до 64 символов");
      await editTask(task.id, title);
      onUpdateTodos();
      setIsEditing(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleToggle = async () => {
    try {
      await toggleTaskStatus(task.id, !task.isDone);
      onUpdateTodos();
    } catch (error) {
      alert("Ошибка при изменении статуса");
    }
  };

  return (
    <li className={styles.taskItem}>
      {isEditing ? (
        <form className={styles.editMode} onSubmit={handleSave}>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className={styles.editInput}
          />
          <button type="submit" className={styles.bSave}>
            Save
          </button>
          <button
            type="button"
            className={styles.bCancel}
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </form>
      ) : (
        <div className={styles.viewMode}>
          <label className={styles.checkboxContainer}>
            <input
              className={styles.checkboxInput}
              type="checkbox"
              checked={task.isDone}
              onChange={handleToggle}
            />
            <span className={styles.checkmark}></span>
            <span
              className={`${styles.taskTitle} ${
                task.isDone ? styles.completed : ""
              }`}
            >
              {task.title}
            </span>
          </label>
          <div className={styles.actions}>
            <button className={styles.btnDelete} onClick={handleDelete} />
            <button
              className={styles.btnEdit}
              onClick={() => setIsEditing(true)}
            />
          </div>
        </div>
      )}
    </li>
  );
};
