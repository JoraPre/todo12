import type { Rule } from "antd/es/form";
import type { FormInstance } from "antd/es/form";

export const usernameRules: Rule[] = [
  { required: true, message: "Имя пользователя обязательно!" },
  {
    min: 1,
    max: 60,
    message: "Имя пользователя должно быть от 1 до 60 символов!",
  },
  {
    pattern: /^[a-zA-Zа-яА-Я0-9]+$/,
    message: "Имя пользователя должно содержать только буквы и цифры!",
  },
];

export const loginRules: Rule[] = [
  { required: true, message: "Логин обязателен!" },
  { min: 2, max: 60, message: "Логин должен быть от 2 до 60 символов!" },
  {
    pattern: /^[a-zA-Z0-9]+$/,
    message: "Логин должен содержать только латинские буквы и цифры!",
  },
];

export const passwordRules: Rule[] = [
  { required: true, message: "Пароль обязателен!" },
  { min: 6, max: 60, message: "Пароль должен быть от 6 до 60 символов!" },
];

export const confirmPasswordRules: Rule[] = [
  {
    required: true,
    message: "Подтверждение пароля обязательно!",
  },
  ({ getFieldValue }: Pick<FormInstance, "getFieldValue">) => ({
    validator(_: Rule, value: string) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Пароли не совпадают!"));
    },
  }),
];

export const emailRules: Rule[] = [
  { required: true, message: "Почтовый адрес обязателен!" },
  {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Некорректный формат email!",
  },
];

export const phoneNumberRules: Rule[] = [
  {
    required: false,
    message: "Некорректный формат номера телефона! Пример: 71234567890",
  },
  {
    pattern: /^\+?[0-9\s\-()]{10,}$/,
    message: "Некорректный формат номера телефона! Пример: 71234567890",
  },
];
