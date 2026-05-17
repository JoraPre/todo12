export type Filter = "all" | "completed" | "inWork";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export interface Stats {
  all: number;
  completed: number;
  inWork: number;
}
