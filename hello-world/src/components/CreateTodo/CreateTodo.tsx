import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { addTask } from "../../api/todoapi";
import { CreateTodoProps } from "../../types.ts/Todot";
import styles from "./CreateTodo.module.css";

export const CreateTodo: React.FC<CreateTodoProps> = ({ onUpdateTodos }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleAddTask = async () => {
    try {
      const values = await form.validateFields();
      const title = values.title.trim();

      if (!title) throw new Error("Заголовок обязательное поле");

      setLoading(true);
      await addTask(title);
      onUpdateTodos();
      form.resetFields();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      className={styles.addTask}
      form={form}
      layout="inline"
      onFinish={handleAddTask}
    >
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
        <Input className={styles.inputEdit} placeholder="Task To Be Done" />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        Add
      </Button>
    </Form>
  );
};
