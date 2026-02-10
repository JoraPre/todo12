import type { FormInstance } from "antd/es/form";
import type { RuleObject } from "antd/es/form";

export const usernameRules = [
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

export const loginRules = [
  { required: true, message: "Логин обязателен!" },
  { min: 2, max: 60, message: "Логин должен быть от 2 до 60 символов!" },
  {
    pattern: /^[a-zA-Z0-9]+$/,
    message: "Логин должен содержать только латинские буквы и цифры!",
  },
];

export const passwordRules = [
  { required: true, message: "Пароль обязателен!" },
  { min: 6, max: 60, message: "Пароль должен быть от 6 до 60 символов!" },
];

export const confirmPasswordRules = [
  {
    required: true,
    message: "Подтверждение пароля обязательно!",
  },
  ({ getFieldValue }: Pick<FormInstance, "getFieldValue">) => ({
    validator(_: RuleObject, value: string) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Пароли не совпадают!"));
    },
  }),
];
export const emailRules = [
  { required: true, message: "Почтовый адрес обязателен!" },
  {
    pattern: /^[a-zA-Zа-яА-ЯёЁ0-9]+@[a-zA-Zа-яА-ЯёЁ]+\.[a-zA-Zа-яА-ЯёЁ]+$/,
    message: "Некорректный формат email!",
  },
];

export const phoneNumberRules = [
  {
    required: false,
    message: "Некорректный формат номера телефона! Пример: +71234567890",
  },
  {
    pattern: /^\+?[0-9\s\-\(\)]{10,}$/,
    message: "Некорректный  as saформат номера телефона! Пример: +71234567890",
  },
];
