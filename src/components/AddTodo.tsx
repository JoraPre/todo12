import { useState } from "react";
import { Button, Input, Space, notification } from "antd";
import { createTodo } from "../api/user";
import { getErrorMessage } from "../helpers/errorMessage";

interface AddTodoProps {
  loadTodos: () => void;
}

export default function AddTodo({ loadTodos }: AddTodoProps) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!title.trim()) return;

    try {
      setLoading(true);
      await createTodo(title.trim());
      setTitle("");
      loadTodos();
    } catch (err) {
      notification.error({
        message: "Ошибка",
        description: getErrorMessage(err),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space style={{ marginBottom: 16 }}>
      <Input
        placeholder="Новая задача..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onPressEnter={handleAdd}
        style={{ width: 300 }}
      />
      <Button type="primary" onClick={handleAdd} loading={loading}>
        Добавить
      </Button>
    </Space>
  );
}
