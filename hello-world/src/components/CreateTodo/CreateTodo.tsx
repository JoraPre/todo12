import React, { useState, useCallback } from "react";
import { Form, Input, Button } from "antd";
import { addTask } from "../../api/todoapi";
import { CreateTodoProps } from "../../types.ts/Todot";

export const CreateTodo: React.FC<CreateTodoProps> = React.memo(
  ({ onUpdateTodos }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleAddTask = useCallback(
      async (values: { title: string }) => {
        try {
          setLoading(true);
          await addTask(values.title.trim());
          onUpdateTodos();
          form.resetFields();
        } catch (error) {
          console.error("Ошибка при добавлении задачи:", error);
        } finally {
          setLoading(false);
        }
      },
      [onUpdateTodos]
    );

    return (
      <Form form={form} layout="inline" onFinish={handleAddTask}>
        <Form.Item
          name="title"
          rules={[
            { required: true, message: "Введите заголовок!" },
            {
              min: 2,
              max: 64,
              message: "Заголовок должен быть от 2 до 64 символов!",
            },
          ]}
        >
          <Input placeholder="Task To Be Done" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Add
        </Button>
      </Form>
    );
  }
);
