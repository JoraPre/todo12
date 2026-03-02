import React from "react";
import { Link, useRouteError } from "react-router-dom";
import { Typography, Button } from "antd";

const { Title } = Typography;

export const ErrorPage: React.FC = () => {
  const error = useRouteError() as {
    status?: number;
    statusText?: string;
    message?: string;
  };

  const status = error?.status || 500;
  const statusText = error?.statusText || "Внутренняя ошибка сервера";

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <Title level={1}>Что-то пошло не так</Title>
      <Title level={2}>
        {status} - {statusText}
      </Title>
      <Link to="/auth?mode=signin">
        <Button type="primary" size="large">
          Войти
        </Button>
      </Link>
    </div>
  );
};
