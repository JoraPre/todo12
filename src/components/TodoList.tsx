import { Button, Checkbox, List, notification } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { Todo } from "../types/typesTodo";
import { deleteTodo, updateTodo } from "../api/user";
import { getErrorMessage } from "../helpers/errorMessage";

interface TodoListProps {
  todos: Todo[];
  loadTodos: () => void;
}

export default function TodoList({ todos, loadTodos }: TodoListProps) {
  const handleToggle = async (todo: Todo) => {
    try {
      await updateTodo(todo.id, { completed: !todo.completed });
      loadTodos();
    } catch (err) {
      notification.error({
        message: "Ошибка",
        description: getErrorMessage(err),
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
      loadTodos();
    } catch (err) {
      notification.error({
        message: "Ошибка",
        description: getErrorMessage(err),
      });
    }
  };

  return (
    <List
      dataSource={todos}
      renderItem={(todo) => (
        <List.Item
          actions={[
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(todo.id)}
            />,
          ]}
        >
          <Checkbox
            checked={todo.completed}
            onChange={() => handleToggle(todo)}
          >
            {}
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.title}
            </span>
          </Checkbox>
        </List.Item>
      )}
    />
  );
}
