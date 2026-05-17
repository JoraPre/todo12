export interface Token {
  accessToken: string;
  refreshToken: string;
}

export interface UserRegistration {
  login: string;
  username: string;
  password: string;
  email: string;
  phoneNumber?: string;
}

export type UserLogin = Pick<UserRegistration, "login" | "password">;

export type AuthResponse = {
  token: Token;
  status: number;
};
