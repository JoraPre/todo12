import React, { useState } from "react";
import styles from "./TodoItem.module.css";
import { removeTask, editTask, toggleTaskStatus } from "../../api/todoapi";

export const TodoItem = ({ task, onUpdateTodos }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);

  const handleDelete = async () => {
    try {
      await removeTask(task.id);
      onUpdateTodos(); // Обновляем список
    } catch (error) {
      alert("Ошибка при удалении задачи");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы

    try {
      const title = newTitle.trim();
      if (!title) {
        alert("Заголовок обязательное поле");
        return;
      }
      if (title.length < 2 || title.length > 64) {
        alert("Заголовок должен быть от 2 до 64 символов");
        return;
      }

      await editTask(task.id, title);
      onUpdateTodos(); // Обновляем список
      setIsEditing(false); // Выходим из режима редактирования
    } catch (error) {
      alert("Ошибка при сохранении задачи");
    }
  };

  const handleToggle = async () => {
    try {
      await toggleTaskStatus(task.id, !task.isDone);
      onUpdateTodos(); // Обновляем список
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
            <span>Save</span>
          </button>
          <button
            type="button"
            className={styles.bCancel}
            onClick={() => setIsEditing(false)}
          >
            <span>Cancel</span>
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
