import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Button,
  Card,
  Form,
  Input,
  Space,
  Spin,
  Typography,
  notification,
} from "antd";
import Title from "antd/es/typography/Title";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectUserId,
  selectUserIdStatus,
  selectUserError,
  selectUserSaving,
} from "../store/users/selectors";
import { clearSelectedUser } from "../store/users/slices/usersSlice";
import { userByIdThunk } from "../store/users/thunks/userByIdThunk";
import { updateUserThunk } from "../store/users/thunks/updateUserThunk";
import { UserRequest } from "../types/typesUsers";
import { usernameRules, emailRules, phoneRules } from "../helpers/validation";
import { usePermissions } from "../helpers/usePermissions";

export function UserEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userId = Number(id);

  const { isAdmin } = usePermissions();

  const user = useAppSelector(selectUserId);
  const status = useAppSelector(selectUserIdStatus);
  const error = useAppSelector(selectUserError);
  const saving = useAppSelector(selectUserSaving);
  const isLoading = status === "loading";

  const [form] = Form.useForm<UserRequest>();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (!id || isNaN(userId)) {
      notification.error({ message: "Некорректный ID" });
      navigate("/users", { replace: true });
      return;
    }

    dispatch(clearSelectedUser());
    dispatch(userByIdThunk(userId));

    return () => {
      dispatch(clearSelectedUser());
    };
  }, [userId]);

  useEffect(() => {
    if (user) {
      form.resetFields();
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber ?? "",
      });
    }
  }, [user, form]);

  const handleCancel = () => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber ?? "",
      });
    }
    setIsEditing(false);
  };

  const handleSave = async (values: UserRequest) => {
    if (!user) return;
    try {
      await dispatch(updateUserThunk({ id: user.id, data: values })).unwrap();
      notification.success({
        message: "Успешно",
        description: "Данные пользователя обновлены",
      });
      setIsEditing(false);
    } catch (err: unknown) {
      notification.error({
        message: "Ошибка",
        description: (err as string) || "Не удалось обновить данные",
      });
    }
  };

  if (isLoading) {
    return (
      <Spin
        tip="Загрузка пользователя..."
        style={{ display: "block", marginTop: 80 }}
        fullscreen
      />
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Typography.Text type="danger">{error}</Typography.Text>
        <div style={{ marginTop: 16 }}>
          <Button onClick={() => navigate("/users")}>Вернуться к списку</Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Typography.Text>Пользователь не найден</Typography.Text>
        <div style={{ marginTop: 16 }}>
          <Button onClick={() => navigate("/users")}>Вернуться к списку</Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 200 }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space style={{ justifyContent: "space-between", width: "100%" }}>
          <Title>Профиль пользователя</Title>
        </Space>

        <Card style={{ maxWidth: 500 }}>
          {}
          <Form<UserRequest>
            form={form}
            layout="vertical"
            onFinish={handleSave}
          >
            {}
            {isEditing ? (
              <>
                <Form.Item
                  label="Имя пользователя"
                  name="username"
                  rules={usernameRules}
                >
                  <Input placeholder="Введите имя пользователя" />
                </Form.Item>
                <Form.Item label="Email" name="email" rules={emailRules}>
                  <Input placeholder="Введите email" />
                </Form.Item>
                <Form.Item
                  label="Телефон"
                  name="phoneNumber"
                  rules={phoneRules}
                >
                  <Input placeholder="Введите номер телефона" />
                </Form.Item>
                <Space>
                  {}
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={saving}
                    disabled={saving}
                  >
                    Сохранить
                  </Button>
                  <Button onClick={handleCancel} disabled={saving}>
                    Отмена
                  </Button>
                </Space>
              </>
            ) : (
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <div>
                  <Typography>Имя пользователя</Typography>
                  <div style={{ fontSize: 16, marginTop: 4 }}>
                    {user.username}
                  </div>
                </div>
                <div>
                  <Typography>Email</Typography>
                  <div style={{ fontSize: 16, marginTop: 4 }}>{user.email}</div>
                </div>
                <div>
                  <Typography>Телефон</Typography>
                  <div style={{ fontSize: 16, marginTop: 4 }}>
                    {user.phoneNumber || "—"}
                  </div>
                </div>
                <Space>
                  {}
                  {isAdmin && (
                    <Button type="primary" onClick={() => setIsEditing(true)}>
                      Редактировать
                    </Button>
                  )}
                  <Button onClick={() => navigate("/users")}>
                    Вернуться к списку
                  </Button>
                </Space>
              </Space>
            )}
          </Form>
        </Card>
      </Space>
    </div>
  );
}
