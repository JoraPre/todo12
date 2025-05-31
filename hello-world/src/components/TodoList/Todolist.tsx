import React from "react";
import { List } from "antd";
import { TodoItem } from "../TodoItem/TodoItem";
import { TodoListProps } from "../../types.ts/Todot";

export const TodoList: React.FC<TodoListProps> = ({ tasks, onUpdateTodos }) => {
  return (
    <List
      dataSource={tasks}
      renderItem={(task) => (
        <List.Item>
          <TodoItem key={task.id} task={task} onUpdateTodos={onUpdateTodos} />
        </List.Item>
      )}
    />
  );
};
