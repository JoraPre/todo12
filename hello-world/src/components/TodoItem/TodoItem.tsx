import React, { useState } from "react";
import { TodoItemProps } from "../../types.ts/Todot";
import { Card, Checkbox, Button, Form, Input } from "antd";
import { toggleTaskStatus, editTask, removeTask } from "../../api/todoapi";
import styles from "./TodoItem.module.css";

export const TodoItem: React.FC<TodoItemProps> = ({ task, onUpdateTodos }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await removeTask(task.id);
      onUpdateTodos();
    } catch (error) {
      alert("Ошибка при удалении задачи");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const title = newTitle.trim();

      if (!title) throw new Error("Заголовок обязательное поле");
      if (title.length < 2 || title.length > 64)
        throw new Error("Заголовок должен быть от 2 до 64 символов");

      setLoading(true);
      await editTask(task.id, title);
      onUpdateTodos();
      setIsEditing(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    try {
      setLoading(true);
      await toggleTaskStatus(task.id, !task.isDone);
      onUpdateTodos();
    } catch (error) {
      alert("Ошибка при изменении статуса");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={styles.taskItem}>
      {isEditing ? (
        <div className={styles.editMode}>
          <Form.Item
            name={`title-${task.id}`}
            rules={[
              { required: true, message: "Заголовок обязательное поле!" },
              {
                min: 2,
                max: 64,
                message: "Заголовок должен быть от 2 до 64 символов!",
              },
            ]}
          >
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onPressEnter={handleSave}
              className={styles.editInput}
            />
          </Form.Item>
          <Button onClick={handleSave} type="primary" className={styles.bSave}>
            Save
          </Button>
          <Button
            onClick={() => setIsEditing(false)}
            type="primary"
            className={styles.bCancel}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className={styles.viewMode}>
          <div className={styles.checkboxContainer}>
            <Checkbox
              checked={task.isDone}
              onChange={handleToggle}
              disabled={loading}
            />
            <span className={styles.checkmark}></span>
            <span
              className={`${styles.taskTitle} ${
                task.isDone ? styles.completed : ""
              }`}
            >
              {task.title}
            </span>
          </div>
          <div className={styles.actions}>
            <Button
              onClick={handleDelete}
              type="primary"
              className={styles.btnDelete}
            >
              Delete
            </Button>
            <Button
              onClick={() => setIsEditing(true)}
              type="primary"
              className={styles.btnEdit}
            >
              Edit
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
