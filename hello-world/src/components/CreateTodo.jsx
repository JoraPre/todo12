import React, { useState } from "react";

export const CreateTodo = ({ onAdd }) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Функция для обработки изменения заголовка задачи
  const handleChangeTaskTitle = (e) => {
    setNewTaskTitle(e.target.value); // Обновляем состояние с новым значением из поля ввода
  };

  // Функция для добавления задачи
  const handleAddTask = () => {
    try {
      const title = newTaskTitle.trim();

      // Проверка на пустой заголовок
      if (!title) throw new Error("Заголовок обязательное поле");

      // Проверка длины заголовка
      if (title.length < 2 || title.length > 64)
        throw new Error("Заголовок должен быть от 2 до 64 символов");

      // Вызов функции добавления задачи
      onAdd(title);

      // Очистка поля ввода
      setNewTaskTitle("");
    } catch (error) {
      // Обработка ошибок
      console.error("Ошибка при добавлении задачи:", error);
      alert(error.message); // Показываем сообщение об ошибке
    }
  };

  return (
    <form
      className="add-task"
      onSubmit={(e) => {
        e.preventDefault(); // Предотвращаем стандартное поведение формы
        handleAddTask(); // Вызываем функцию добавления задачи
      }}
    >
      <input
        placeholder="Task To Be Done"
        className="input-edit"
        value={newTaskTitle}
        onChange={handleChangeTaskTitle} // Используем функцию handleChangeTaskTitle
      />
      <button className="btn-add" type="submit">
        Add
      </button>
    </form>
  );
};
