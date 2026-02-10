import React from "react";
import { Link, redirect } from "react-router-dom";
import type { ActionFunctionArgs } from "react-router-dom";

import AuthForm from "../../components/authForm/authForm11.tsx";
import { signIn, signUp } from "../../Api/apiclone1.tsx";
import { tokenManager } from "../../tokenmanager/tokenmanager.tsx";
import type {
  UserRegistration,
  UserLogin,
  AuthResponse,
} from "../../types/type.tsx";

const AuthenticationPage: React.FC = () => {
  return <AuthForm />;
};

export default AuthenticationPage;

interface ActionResponse {
  success?: boolean;
  message?: React.ReactNode | string;
}

export async function action({
  request,
}: ActionFunctionArgs): Promise<Response | ActionResponse> {
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") || "signin";

  if (mode !== "signin" && mode !== "signup") {
    return {
      success: false,
      message: "Неподдерживаемый режим.",
    };
  }

  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const { email, username, login, password, phoneNumber } = data;

  const authData: UserLogin = {
    login: String(login || ""),
    password: String(password || ""),
  };

  const registrationData: UserRegistration = {
    ...authData,
    email: String(email || ""),
    username: String(username || ""),
  };

  if (
    phoneNumber === "string" &&
    phoneNumber.trim() !== "" &&
    phoneNumber !== null
  ) {
    registrationData.phoneNumber = "+" + phoneNumber;
  }

  try {
    const response: AuthResponse =
      mode === "signin"
        ? await signIn(authData)
        : await signUp(registrationData);

    if (response.status !== 200 && response.status !== 201) {
      const statusMessages: Record<number, string> = {
        400: "Неверные данные. Попробуйте снова.",
        401: "Неверные учетные данные.",
        409: "Пользователь уже существует. Войдите.",
      };
      const errorMessage =
        statusMessages[response.status] ||
        "Ошибка аутентификации. Попробуйте позже.";
      return {
        success: false,
        message: errorMessage,
      };
    }

    if (response.token) {
      tokenManager.setAccessToken(response.token.accessToken);
      tokenManager.setRefreshToken(response.token.refreshToken);
    }

    if (mode === "signin") {
      return redirect("/");
    }

    return {
      success: true,
      message: (
        <>
          Успешно зарегистрировано. Перейдите на{" "}
          <Link to="/auth?mode=signin">страницу авторизации</Link> для входа
        </>
      ),
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return {
      success: false,
      message: "Неожиданная ошибка. Попробуйте позже.",
    };
  }
}
