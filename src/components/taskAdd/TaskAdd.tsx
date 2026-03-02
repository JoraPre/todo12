import React, { useState } from "react";
import { Button, Col, Row, Input, message, Form, type FormProps } from "antd";
import { createTask } from "../../api/api";

type TaskAddProps = {
  updateTasks: () => Promise<void>;
};

const TASK_INPUT_LENGTH = { MIN: 1, MAX: 100 };

const validationRules = [
  { required: true, message: "Название задачи обязательно" },
  {
    min: TASK_INPUT_LENGTH.MIN,
    message: `Минимум ${TASK_INPUT_LENGTH.MIN} символов`,
  },
  {
    max: TASK_INPUT_LENGTH.MAX,
    message: `Максимум ${TASK_INPUT_LENGTH.MAX} символов`,
  },
];

const TaskAdd: React.FC<TaskAddProps> = ({ updateTasks }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate: FormProps["onFinish"] = async (values) => {
    setIsCreating(true);
    try {
      await createTask(values.title);
      await updateTasks();
      form.resetFields();
    } catch (error) {
      console.error(error);
      messageApi.open({
        type: "error",
        content: "Не удалось создать задачу. Попробуйте снова.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div style={{ width: 400, margin: "0 auto" }}>
      <Form form={form} onFinish={handleCreate}>
        {contextHolder}
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={18}>
            <Form.Item name="title" rules={validationRules} noStyle>
              <Input
                placeholder="Задача..."
                count={{ show: true, max: TASK_INPUT_LENGTH.MAX }}
                disabled={isCreating}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isCreating}
              disabled={isCreating}
            >
              Добавить
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default TaskAdd;
