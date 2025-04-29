import React, { useState } from "react";
import styles from "./CreateTodo.module.css";
import { addTask } from "../../api/todoapi";

type CreateTodoProps = {
  onUpdateTodos: () => void;
};

export const CreateTodo: React.FC<CreateTodoProps> = ({ onUpdateTodos }) => {
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

  return (
    <form className={styles.addTask} onSubmit={(e) => e.preventDefault()}>
      <input
        placeholder="Task To Be Done"
        className={styles.inputEdit}
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
      />
      <button className={styles.btnAdd} type="button" onClick={handleAddTask}>
        Add
      </button>
    </form>
  );
};
