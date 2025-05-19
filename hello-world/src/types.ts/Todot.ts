export type Task = {
  id: number;
  title: string;
  isDone: boolean;
};

export type ApiResponse = {
  data: Task[];
  info: {
    all: number;
    inWork: number;
    completed: number;
  };
};

export type TodoItemProps = {
  task: Task;
  onUpdateTodos: () => void;
};

export type TodoListProps = {
  tasks: TodoItemProps["task"][];
  onUpdateTodos: () => void;
};
export type CreateTodoProps = {
  onUpdateTodos: () => void;
};
export type FiltersProps = {
  filter: FilterStatus;
  onChangeFilter: (status: FilterStatus) => void;
  counts: {
    all: number;
    inWork: number;
    completed: number;
  };
};
export type FilterStatus = "all" | "inWork" | "completed";
