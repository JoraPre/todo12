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

export interface UserRegistration {
  login: string;
  username: string;
  password: string;
  email: string;
  phoneNumber?: string;
}

export type AuthResponse = {
  token?: Token;
  status: number;
};

export type UserLogin = Pick<UserRegistration, "login" | "password">;

export type Role = "ADMIN" | "USER" | "MODERATOR";

export interface Token {
  accessToken: string;
  refreshToken: string;
}

export interface Profile {
  id: number;
  username: string;
  email: string;
  date: string;
  isBlocked: boolean;
  roles: Role[];
  phoneNumber: string;
}
