import React, { useState, useEffect } from "react";
import { CreateTodo } from "../components/CreateTodo";
import { Filters } from "../components/Filters";
import { TodoList } from "../components/Todolist";
import { fetchTasks } from "../api/todoApi";

export function TodoPage() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [counts, setCounts] = useState({ all: 0, inWork: 0, completed: 0 });

  const loadTasks = async () => {
    try {
      const data = await fetchTasks(filter);
      setTasks(data.data);
      setCounts(data.info);
    } catch (error) {
      alert("Ошибка при загрузке задач");
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filter]);

  const handleAdd = () => loadTasks();
  const handleRemove = () => loadTasks();
  const handleEdit = () => loadTasks();
  const handleToggle = () => loadTasks();

  return (
    <div className="todolist">
      <CreateTodo onAdd={handleAdd} />
      <Filters filter={filter} onChangeFilter={setFilter} counts={counts} />
      <TodoList
        tasks={tasks}
        onRemove={handleRemove}
        onEdit={handleEdit}
        onToggle={handleToggle}
      />
    </div>
  );
}

// import { useState, useEffect, useCallback } from "react";
// import { CreateTodo } from "../components/CreateTodo";
// import { Filters } from "../components/Filters";
// import { TodoList } from "../components/Todolist.jsx";
// import {
//   fetchTasks,
//   removeTask,
//   addTask,
//   editTask,
//   toggleTaskStatus,
// } from "../api/todoApi";

// export function TodoPage() {
//   const [tasks, setTasks] = useState([]);
//   const [filter, setFilter] = useState("all");
//   const [counts, setCounts] = useState({ all: 0, inWork: 0, completed: 0 });

//   const loadTasks = useCallback(async () => {
//     try {
//       const data = await fetchTasks(filter);
//       setTasks(data.data);
//       setCounts(data.info);
//     } catch (error) {
//       alert("Ошибка при загрузке задач");
//     }
//   }, [filter]);

//   useEffect(() => {
//     loadTasks();
//   }, [filter, loadTasks]);

//   const handleAdd = async (title) => {
//     try {
//       await addTask(title);
//       await loadTasks();
//     } catch (error) {
//       alert("Ошибка при добавлении задачи");
//     }
//   };

//   const handleRemove = async (id) => {
//     try {
//       await removeTask(id);
//       await loadTasks();
//     } catch (error) {
//       alert("Ошибка при удалении задачи");
//     }
//   };

//   const handleEdit = async (id, newTitle) => {
//     try {
//       await editTask(id, newTitle);
//       await loadTasks();
//     } catch (error) {
//       alert("Ошибка при редактировании задачи");
//     }
//   };

//   const handleToggle = async (id) => {
//     try {
//       const task = tasks.find((t) => t.id === id);
//       await toggleTaskStatus(id, !task.isDone);
//       await loadTasks();
//     } catch (error) {
//       alert("Ошибка при изменении статуса задачи");
//     }
//   };

//   return (
//     <div className="todolist">
//       <CreateTodo onAdd={handleAdd} />
//       <Filters filter={filter} onChangeFilter={setFilter} counts={counts} />
//       <TodoList
//         tasks={tasks}
//         onRemove={handleRemove}
//         onEdit={handleEdit}
//         onToggle={handleToggle}
//       />
//     </div>
//   );
// }
