import React from "react";
import { List } from "antd";
import { TodoItem } from "../TodoItem/TodoItem";
import { TodoListProps } from "../../types.ts/Todot";
import styles from "./TodoList.module.css";

export const TodoList: React.FC<TodoListProps> = ({ tasks, onUpdateTodos }) => {
  return (
    <div className={styles.taskList}>
      <List
        dataSource={tasks}
        renderItem={(task) => (
          <List.Item>
            <TodoItem key={task.id} task={task} onUpdateTodos={onUpdateTodos} />
          </List.Item>
        )}
      />
    </div>
  );
};
