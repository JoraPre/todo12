export type TodoRequest = Partial<Pick<Todo, "title" | "isDone">>;

export interface Todo {
  id: number;
  title: string;
  created?: string;
  isDone: boolean;
}

export interface TodoInfo {
  all: number;
  completed: number;
  inWork: number;
}

export type TaskCategory = keyof TodoInfo;
