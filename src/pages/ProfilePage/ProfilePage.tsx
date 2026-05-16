import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearError } from "../../store/auth/slices/authSlice";
import { Button, Card, Space, Typography, Spin, notification } from "antd";
import { logoutThunk } from "../../store/auth/thunks/logoutThunk";
import {
  selectAuthError,
  selectAuthStatus,
  selectUserProfile,
} from "../../store/auth/selectors";
import Error from "../../components/Error";
import { getErrorMessage } from "../../helpers/errorMessage";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(selectUserProfile);
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);

  useEffect(() => {
    if (!user && status !== "loading") {
      dispatch(logoutThunk())
        .unwrap()
        .then(() => navigate("/login", { replace: true }))
        .catch((err: unknown) => {
          notification.error({
            message: "Ошибка",
            description: getErrorMessage(err) || "Ошибка при выходе из профиля",
          });
        });
    }
  }, [user, status]);

  if (status === "loading") {
    return <Spin tip="Загрузка пользователя..." />;
  }

  if (error) {
    return (
      <Card title="Профиль" style={{ width: 500 }}>
        <Error message={error} onClose={() => dispatch(clearError())} />
      </Card>
    );
  }

  if (!user) {
    return (
      <Card title="Профиль" style={{ width: 500 }}>
        <Typography.Text>Профиль не загружен</Typography.Text>
        <Button type="primary" onClick={() => navigate("/login")}>
          Войдите заново
        </Button>
      </Card>
    );
  }

  const handleLogout = () => {
    dispatch(logoutThunk())
      .unwrap()
      .then(() => navigate("/login", { replace: true }))
      .catch((err: unknown) => {
        notification.error({
          message: "Ошибка",
          description: getErrorMessage(err) || "Ошибка при выходе из профиля",
        });
      });
  };

  return (
    <Card title="Профиль" style={{ width: 500 }}>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Typography.Text strong>Имя пользователя:</Typography.Text>
        <Typography.Text>{user.username}</Typography.Text>

        <Typography.Text strong>Email:</Typography.Text>
        <Typography.Text>{user.email}</Typography.Text>

        <Typography.Text strong>Телефон:</Typography.Text>
        <Typography.Text>{user.phoneNumber || "Не указан"}</Typography.Text>

        <Button type="primary" onClick={handleLogout} style={{ marginTop: 16 }}>
          Выйти
        </Button>
      </Space>
    </Card>
  );
}
