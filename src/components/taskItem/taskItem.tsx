import React, { useState } from "react";
import { Checkbox, Button, Input, message, Form } from "antd";
import { updateTask, deleteTask } from "../../Api/apiclone1.tsx";
import type { Todo } from "../../types/type.tsx";

const TASK_INPUT_LENGTH = { MIN: 1, MAX: 100 };

import { Space } from "antd";
import {
  SaveOutlined,
  EditOutlined,
  DeleteOutlined,
  CloseOutlined,
} from "@ant-design/icons";

type TaskItemProps = {
  task: Todo;
  updateTasks: () => Promise<void>;
};

const TaskItem: React.FC<TaskItemProps> = ({ task, updateTasks }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async (values: { title: string }) => {
    const title = values.title;
    setIsUpdating(true);

    try {
      await updateTask({ ...task, title: title });
      await updateTasks();
      setIsEditing(false);
      messageApi.success("Task updated");
    } catch (error) {
      console.error(error);
      messageApi.error("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    form.setFieldsValue({ title: task.title });
    setIsEditing(false);
  };

  const handleCheckboxClick = async () => {
    setIsUpdating(true);
    try {
      await updateTask({ ...task, isDone: !task.isDone });
      await updateTasks();
    } catch (error) {
      console.error(error);
      messageApi.error("Status update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    setIsUpdating(true);
    try {
      await deleteTask(id);
      await updateTasks();
      messageApi.success("Task deleted");
    } catch (error) {
      console.error(error);
      messageApi.error("Delete failed");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div style={{ width: 400, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px",
          borderBottom: "1px solid #f0f0f0",
          gap: "12px",
        }}
      >
        {contextHolder}

        <Checkbox
          onChange={handleCheckboxClick}
          checked={task.isDone}
          disabled={isUpdating}
        />

        <Form
          form={form}
          initialValues={{ title: task.title }}
          onFinish={handleSave}
          style={{ flex: 1 }}
        >
          {isEditing ? (
            <Space style={{ width: "100%" }}>
              <Form.Item
                name="title"
                rules={[
                  { required: true, message: "Required" },
                  {
                    min: TASK_INPUT_LENGTH.MIN,
                    message: `Min ${TASK_INPUT_LENGTH.MIN} chars`,
                  },
                  {
                    max: TASK_INPUT_LENGTH.MAX,
                    message: `Max ${TASK_INPUT_LENGTH.MAX} chars`,
                  },
                ]}
                style={{ flex: 1, marginBottom: 0 }}
              >
                <Input disabled={isUpdating} style={{ minWidth: "200px" }} />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isUpdating}
                disabled={isUpdating}
                icon={<SaveOutlined />}
                size="small"
              />
              <Button
                onClick={handleCancel}
                disabled={isUpdating}
                icon={<CloseOutlined />}
                size="small"
              />
            </Space>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <span
                style={{
                  textDecoration: task.isDone ? "line-through" : "none",
                  color: task.isDone ? "#8c8c8c" : "#000",
                  flex: 1,
                }}
              >
                {task.title}
              </span>
              <Space size="small">
                <Button
                  onClick={() => setIsEditing(true)}
                  type="text"
                  disabled={isUpdating}
                  icon={<EditOutlined />}
                  size="small"
                />
                <Button
                  onClick={() => handleDelete(task.id)}
                  type="primary"
                  danger
                  loading={isUpdating}
                  disabled={isUpdating}
                  icon={<DeleteOutlined />}
                  size="small"
                />
              </Space>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default TaskItem;
