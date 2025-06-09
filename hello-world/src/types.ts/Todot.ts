export type Task = {
  id: number;
  title: string;
  isDone: boolean;
};

export type TaskInfo<T> = {
  all: T;
  inWork: T;
  completed: T;
};

export type ApiResponse = {
  data: Task[];
  info: {
    all: number;
    inWork: number;
    completed: number;
  };
};

export type FilterStatus = "all" | "inWork" | "completed";
