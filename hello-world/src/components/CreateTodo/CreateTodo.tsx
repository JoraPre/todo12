import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { addTask } from "../../api/todoapi";

import { TITLE_MAX_LENGTH, TITLE_MIN_LENGTH } from "../../constants";

type CreateTodoProps = {
  onUpdateTodos: () => void;
};

export const CreateTodo: React.FC<CreateTodoProps> = React.memo(
  ({ onUpdateTodos }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleAddTask = async (values: { title: string }) => {
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
    };

    return (
      <Form form={form} layout="inline" onFinish={handleAddTask}>
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
          <Input placeholder="Task To Be Done" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Add
        </Button>
      </Form>
    );
  }
);
