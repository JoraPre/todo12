import React, { useState } from "react";

export const TodoItem = ({ task, onRemove, onEdit, onToggle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);

  const handleSave = () => {
    if (!newTitle.trim()) {
      alert("Заголовок обязательное поле");
      return;
    }
    if (newTitle.length < 2 || newTitle.length > 64) {
      alert("Заголовок должен быть от 2 до 64 символов");
      return;
    }
    onEdit(task.id, newTitle);
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
          <button onClick={() => setIsEditing(false)}>Cancel</button>
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
            <span
              style={{
                textDecoration: task.isDone ? "line-through" : "none",
                color: task.isDone ? "#808080" : "inherit",
              }}
              className="task-title"
            >
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
