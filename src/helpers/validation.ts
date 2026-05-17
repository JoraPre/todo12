import type { Rule } from "antd/es/form";

export const usernameRules: Rule[] = [
  { required: true, message: "Введите имя пользователя" },
  { min: 3, message: "Минимум 3 символа" },
];

export const emailRules: Rule[] = [
  { required: true, message: "Введите email" },
  { type: "email", message: "Введите корректный email" },
];

export const phoneRules: Rule[] = [
  {
    pattern: /^\+?[0-9\s\-()]{7,20}$/,
    message: "Введите корректный номер телефона",
  },
];
