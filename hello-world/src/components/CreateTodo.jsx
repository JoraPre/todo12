import React, { useState } from "react";

export const CreateTodo = ({ onAdd }) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleChangeTaskTitle = (e) => {
    setNewTaskTitle(e.target.value);
  };

  const handleAddTask = () => {
    try {
      const title = newTaskTitle.trim();

      if (!title) throw new Error("Заголовок обязательное поле");

      if (title.length < 2 || title.length > 64)
        throw new Error("Заголовок должен быть от 2 до 64 символов");

      onAdd(title);

      setNewTaskTitle("");
    } catch (error) {
      console.error("Ошибка при добавлении задачи:", error);
      alert(error.message);
    }
  };

  return (
    <form
      className="add-task"
      onSubmit={(e) => {
        e.preventDefault();
        handleAddTask();
      }}
    >
      <input
        placeholder="Task To Be Done"
        className="input-edit"
        value={newTaskTitle}
        onChange={handleChangeTaskTitle}
      />
      <button className="btn-add" type="submit">
        Add
      </button>
    </form>
  );
};
