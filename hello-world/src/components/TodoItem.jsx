import React, { useState } from "react";
import { removeTask, editTask, toggleTaskStatus } from "../api/todoApi";

export const TodoItem = ({ task, onRemove, onEdit, onToggle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);

  const handleDelete = async () => {
    try {
      await removeTask(task.id);
      onRemove(task.id);
    } catch (error) {
      alert("Ошибка при удалении задачи");
    }
  };

  const handleSave = async () => {
    try {
      const title = newTitle.trim();
      if (!title) throw new Error("Заголовок обязательное поле");
      if (title.length < 2 || title.length > 64)
        throw new Error("Заголовок должен быть от 2 до 64 символов");
      await editTask(task.id, title);
      onEdit(task.id, title);
      setIsEditing(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleToggle = async () => {
    try {
      await toggleTaskStatus(task.id, !task.isDone);
      onToggle(task.id);
    } catch (error) {
      alert("Ошибка при изменении статуса");
    }
  };

  return (
    <li className="task-item">
      {isEditing ? (
        <div className="edit-mode">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button className="bSave" onClick={handleSave}>
            <span> Save</span>
          </button>
          <button className="bCancel" onClick={() => setIsEditing(false)}>
            <span>Cancel</span>
          </button>
        </div>
      ) : (
        <div className="view-mode">
          <label className="checkbox-container">
            <input
              className="checkbox-input"
              type="checkbox"
              checked={task.isDone}
              onChange={handleToggle}
            />
            <span className="checkmark"></span>
            <span className={`task-title ${task.isDone ? "completed" : ""}`}>
              {task.title}
            </span>
          </label>
          <div className="actions">
            <button className="btn-delete" onClick={handleDelete} />
            <button className="btn-edit" onClick={() => setIsEditing(true)} />
          </div>
        </div>
      )}
    </li>
  );
};
