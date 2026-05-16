import { useState, useEffect, useCallback } from "react";
import AddTodo from "../../components/AddTodo";
import TodoFilter from "../../components/TodoFilter";
import TodoList from "../../components/TodoList";
import Error from "../../components/Error";
import { getTodos } from "../../api/user";
import type { Stats, Filter, Todo } from "../../types/typesTodo";
import { getErrorMessage } from "../../helpers/errorMessage";
import { AUTO_REFRESH_DELAY } from "../../helpers/constants";

export default function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<Filter>("all");
  const [status, setStatus] = useState<Stats>({
    all: 0,
    completed: 0,
    inWork: 0,
  });

  const loadTodos = useCallback(async () => {
    try {
      const res = await getTodos(filter);
      setTodos(res.data);

      const data = res.info ?? { all: 0, completed: 0, inWork: 0 };
      setStatus(data);
      setError("");
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  }, [filter]);

  useEffect(() => {
    loadTodos();

    const interval = setInterval(loadTodos, AUTO_REFRESH_DELAY);

    return () => clearInterval(interval);
  }, [loadTodos]);

  return (
    <>
      {}
      <AddTodo loadTodos={loadTodos} />
      <TodoFilter filter={filter} onFilterChange={setFilter} status={status} />
      {error && (
        <Error title="Ошибка" message={error} onClose={() => setError("")} />
      )}
      <TodoList todos={todos} loadTodos={loadTodos} />
    </>
  );
}
