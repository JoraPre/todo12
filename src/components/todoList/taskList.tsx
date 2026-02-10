import React from "react";
import { List, Button, Col, Row } from "antd";

import TaskItem from "../taskItem/taskItem.tsx";
import type { Todo, TodoInfo, TaskCategory } from "../../types/type.tsx";

type TodoListProps = {
  tasks: Todo[];
  filter: TodoInfo;
  category: TaskCategory;
  updateTasks: (category: TaskCategory) => void;
  fetchTasks: () => Promise<void>;
};

const STATUS = {
  ALL: "all",
  INWORK: "inWork",
  COMPLETED: "completed",
} as const;

const TodoList: React.FC<TodoListProps> = ({
  tasks,
  filter,
  category,
  updateTasks,
  fetchTasks,
}) => {
  const renderTaskSwitch = () => (
    <nav className="tabs">
      <Row>
        <Col span={6} offset={3}>
          <Button
            type="link"
            className={`tab-link ${category === STATUS.ALL ? "active" : ""}`}
            onClick={() => updateTasks(STATUS.ALL)}
          >
            Все({filter.all})
          </Button>
        </Col>
        <Col span={6}>
          <Button
            type="link"
            className={`tab-link ${category === STATUS.INWORK ? "active" : ""}`}
            onClick={() => updateTasks(STATUS.INWORK)}
          >
            В работе({filter.inWork})
          </Button>
        </Col>
        <Col span={6}>
          <Button
            type="link"
            className={`tab-link ${
              category === STATUS.COMPLETED ? "active" : ""
            }`}
            onClick={() => updateTasks(STATUS.COMPLETED)}
          >
            Завершенные({filter.completed})
          </Button>
        </Col>
      </Row>
    </nav>
  );

  const renderTaskList = () => (
    <List
      dataSource={tasks}
      renderItem={(task) => (
        <List.Item key={task.id}>
          <TaskItem task={task} updateTasks={fetchTasks} />
        </List.Item>
      )}
    />
  );

  return (
    <div style={{ width: 400, margin: "0 auto" }}>
      {renderTaskSwitch()}
      {renderTaskList()}
    </div>
  );
};

export default TodoList;
