import React, { useState, useCallback } from "react";
import { Task } from "../../types.ts/Todot";
import { Card, Checkbox, Button, Form, Input } from "antd";
import { toggleTaskStatus, editTask, removeTask } from "../../api/todoapi";
import { TITLE_MAX_LENGTH, TITLE_MIN_LENGTH } from "../../constants";

type TodoItemProps = {
  task: Task;
  onUpdateTodos: () => void;
};

export const TodoItem: React.FC<TodoItemProps> = React.memo(
  ({ task, onUpdateTodos }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(task.title);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleDelete = async () => {
      try {
        setLoading(true);
        await removeTask(task.id);
        onUpdateTodos();
      } catch {
        alert("Ошибка при удалении задачи");
      } finally {
        setLoading(false);
      }
    };

    const handleSave = async (values: { title: string }) => {
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
    };

    const handleToggle = async () => {
      try {
        setLoading(true);
        await toggleTaskStatus(task.id, !task.isDone);
        onUpdateTodos();
      } catch {
        alert("Ошибка при изменении статуса");
      } finally {
        setLoading(false);
      }
    };

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
                  min: TITLE_MIN_LENGTH,
                  max: TITLE_MAX_LENGTH,
                  message: `Заголовок должен быть от ${TITLE_MIN_LENGTH} до ${TITLE_MAX_LENGTH} символов!`,
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
