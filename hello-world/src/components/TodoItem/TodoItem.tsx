import React, { useState, useCallback } from "react";
import { TodoItemProps } from "../../types.ts/Todot";
import { Card, Checkbox, Button, Form, Input } from "antd";
import { toggleTaskStatus, editTask, removeTask } from "../../api/todoapi";

export const TodoItem: React.FC<TodoItemProps> = React.memo(
  ({ task, onUpdateTodos }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(task.title);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleDelete = useCallback(async () => {
      try {
        setLoading(true);
        await removeTask(task.id);
        onUpdateTodos();
      } catch {
        alert("Ошибка при удалении задачи");
      } finally {
        setLoading(false);
      }
    }, [task.id, onUpdateTodos]);

    const handleSave = useCallback(
      async (values: { title: string }) => {
        try {
          const title = values.title.trim();
          setLoading(true);
          await editTask(task.id, title);
          onUpdateTodos();
          setIsEditing(false);
        } catch {
          alert("Ошибка при сохранении изменений");
        } finally {
          setLoading(false);
        }
      },
      [task.id, onUpdateTodos]
    );

    const handleToggle = useCallback(async () => {
      try {
        setLoading(true);
        await toggleTaskStatus(task.id, !task.isDone);
        onUpdateTodos();
      } catch {
        alert("Ошибка при изменении статуса");
      } finally {
        setLoading(false);
      }
    }, [task.id, task.isDone, onUpdateTodos]);

    return (
      <Card>
        {isEditing ? (
          <Form
            form={form}
            layout="inline"
            onFinish={handleSave}
            initialValues={{ title: task.title }}
          >
            <Form.Item
              name="title"
              rules={[
                { required: true, message: "Заголовок обязательное поле!" },
                {
                  min: 2,
                  max: 64,
                  message: "Заголовок должен быть от 2 до 64 символов!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Button htmlType="submit">Save</Button>
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          </Form>
        ) : (
          <div>
            <div>
              <Checkbox
                checked={task.isDone}
                onChange={handleToggle}
                disabled={loading}
              />
              <span>{task.title}</span>
            </div>
            <div>
              <Button onClick={handleDelete}>Delete</Button>
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            </div>
          </div>
        )}
      </Card>
    );
  }
);
