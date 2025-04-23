import React, { useState } from "react";
import styles from "./CreateTodo.module.css";
import { addTask } from "../../api/todoapi";

export const CreateTodo = ({ onUpdateTodos }) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleAddTask = async () => {
    try {
      const title = newTaskTitle.trim();
      if (!title) throw new Error("Заголовок обязательное поле");
      if (title.length < 2 || title.length > 64)
        throw new Error("Заголовок должен быть от 2 до 64 символов");
      await addTask(title);
      onUpdateTodos();
      setNewTaskTitle("");
    } catch (error) {
      alert(error.message);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddTask();
  };

  const handleChangeTaskTitle = (e) => {
    setNewTaskTitle(e.target.value);
  };

  return (
    <form className={styles.addTask} onSubmit={handleSubmit}>
      <input
        placeholder="Task To Be Done"
        className={styles.inputEdit}
        value={newTaskTitle}
        onChange={handleChangeTaskTitle}
      />
      <button className={styles.btnAdd} type="submit">
        Add
      </button>
    </form>
  );
};
