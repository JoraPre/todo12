import React from "react";
import { List, Button, Col, Row } from "antd";
import TaskItem from "../taskItem/TaskItem";
import type { Todo, TodoInfo, TaskCategory } from "../../types/todo";

type TodoListProps = {
  tasks: Todo[];
  filter: TodoInfo;
  category: TaskCategory;
  updateTasks: (category: TaskCategory) => void;
  fetchTasks: () => Promise<void>;
};

const TodoList: React.FC<TodoListProps> = ({
  tasks,
  filter,
  category,
  updateTasks,
  fetchTasks,
}) => {
  const tabs: { key: TaskCategory; label: string }[] = [
    { key: "all", label: `Все (${filter.all})` },
    { key: "inWork", label: `В работе (${filter.inWork})` },
    { key: "completed", label: `Завершённые (${filter.completed})` },
  ];

  return (
    <div style={{ width: 400, margin: "0 auto" }}>
      <nav>
        <Row>
          {tabs.map((tab) => (
            <Col key={tab.key} span={8}>
              <Button
                type="link"
                style={{ fontWeight: category === tab.key ? "bold" : "normal" }}
                onClick={() => updateTasks(tab.key)}
              >
                {tab.label}
              </Button>
            </Col>
          ))}
        </Row>
      </nav>

      <List
        dataSource={tasks}
        renderItem={(task) => (
          <List.Item key={task.id}>
            <TaskItem task={task} updateTasks={fetchTasks} />
          </List.Item>
        )}
      />
    </div>
  );
};

export default TodoList;
