export interface User {
  id: number;
  username: string;
  email: string;
  date: string;
  isBlocked: boolean;
  roles: string[];
  phoneNumber?: string;
}

export type PeriodType = "day" | "week" | "month";

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  roleStats: { role: string; count: number }[];
  registrationData: { label: string; count: number }[];
}

export interface AuthData {
  login: string;
  password: string;
}
