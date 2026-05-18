import { api } from "./auth";
import type { User, PeriodType, DashboardStats } from "./types";

export async function getAllUsers() {
  const response = await api.get("/admin/users", {
    params: { limit: 1000, page: 1 },
  });
  return response.data;
}

export function computeStats(
  users: User[],
  period: PeriodType,
): DashboardStats {
  const totalUsers = users.length;
  const blockedUsers = users.filter((u) => u.isBlocked).length;
  const activeUsers = totalUsers - blockedUsers;

  const roleCounts: Record<string, number> = {};
  users.forEach((u) => {
    u.roles.forEach((role) => {
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });
  });
  const roleStats = Object.entries(roleCounts).map(([role, count]) => ({
    role,
    count,
  }));

  const registrationData: { label: string; count: number }[] = [];
  const now = new Date();

  for (let i = 9; i >= 0; i--) {
    let start: Date;
    let end: Date;
    let label: string;

    if (period === "day") {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      start.setHours(0, 0, 0, 0);

      end = new Date(start);
      end.setHours(23, 59, 59, 999);

      label = start.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
      });
    } else if (period === "week") {
      const dayOfWeek = now.getDay();
      start = new Date(now);
      start.setDate(
        now.getDate() - i * 7 - (dayOfWeek === 0 ? 6 : dayOfWeek - 1),
      );
      start.setHours(0, 0, 0, 0);

      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);

      label = `Нед ${start.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" })}`;
    } else {
      start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      end.setHours(23, 59, 59, 999);

      label = start.toLocaleDateString("ru-RU", {
        month: "short",
        year: "2-digit",
      });
    }

    const count = users.filter((u) => {
      const userDate = new Date(u.date);
      return userDate >= start && userDate <= end;
    }).length;

    registrationData.push({ label, count });
  }

  return {
    totalUsers,
    activeUsers,
    blockedUsers,
    roleStats,
    registrationData,
  };
}
