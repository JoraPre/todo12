import React, { useState } from "react";

export const CreateTodo = ({ onAdd }) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      alert("Заголовок обязательное поле");
      return;
    }
    if (newTaskTitle.length < 2 || newTaskTitle.length > 64) {
      alert("Заголовок должен быть от 2 до 64 символов");
      return;
    }
    onAdd(newTaskTitle);
    setNewTaskTitle("");
  };

  return (
    <div className="add-task">
      <input
        placeholder="Task To Be Done"
        className="input-edit"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
      />
      <button className="btn-add" onClick={handleAddTask}>
        Add
      </button>
    </div>
  );
};
