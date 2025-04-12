// src/components/TodoItem.jsx
import React, { useState } from "react";

export const TodoItem = ({ task, onRemove, onEdit, onToggle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);

  const handleSave = () => {
    try {
      const title = newTitle.trim();

      // Проверка на пустой заголовок
      if (!title) throw new Error("Заголовок обязательное поле");

      // Проверка длины заголовка
      if (title.length < 2 || title.length > 64)
        throw new Error("Заголовок должен быть от 2 до 64 символов");

      // Вызов функции редактирования задачи
      onEdit(task.id, title);

      // Выход из режима редактирования
      setIsEditing(false);
    } catch (error) {
      // Обработка ошибок
      console.error("Ошибка при сохранении задачи:", error);
      alert(error.message); // Показываем сообщение об ошибке
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
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
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <div className="view-mode">
          <label className="checkbox-container">
            <input
              className="checkbox-input"
              type="checkbox"
              checked={task.isDone}
              onChange={() => onToggle(task.id)}
            />
            <span className="checkmark"></span>
            <span className={`task-title ${task.isDone ? "completed" : ""}`}>
              {task.title}
            </span>
          </label>
          <div className="actions">
            <button className="btn-delete" onClick={() => onRemove(task.id)} />
            <button className="btn-edit" onClick={() => setIsEditing(true)} />
          </div>
        </div>
      )}
    </li>
  );
};
