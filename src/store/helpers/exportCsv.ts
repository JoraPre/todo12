import type { User } from "../../types.ts/types";
export function exportUsersToCsv(users: User[]): void {
  const headers = [
    "ID",
    "Имя",
    "Email",
    "Телефон",
    "Роли",
    "Статус",
    "Дата регистрации",
  ];

  const rows = users.map((u) => [
    u.id,
    u.username,
    u.email,
    u.phoneNumber ?? "",
    u.roles.join("; "),
    u.isBlocked ? "Заблокирован" : "Активен",
    new Date(u.date).toLocaleDateString("ru-RU"),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");

  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `users_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();

  URL.revokeObjectURL(url);
}
