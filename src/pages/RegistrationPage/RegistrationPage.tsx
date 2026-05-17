import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { registrationThunk } from "../../store/auth/thunks/registrationThunk";
import { clearError } from "../../store/auth/slices/authSlice";
import type { UserRegistration } from "../../types/typesAuth";
import { Form, Input, Button, Typography, Flex, notification } from "antd";
import Error from "../../components/Error";
import { getErrorMessage } from "../../helpers/errorMessage";

const { Title, Text } = Typography;

export default function RegistrationPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { registrationStatus, error } = useAppSelector((state) => state.auth);
  const [form] = Form.useForm();

  const handleRegister = async (values: UserRegistration) => {
    try {
      await dispatch(registrationThunk(values)).unwrap();
      notification.success({ message: "Регистрация прошла успешно!" });
      navigate("/login", { replace: true });
    } catch (err: unknown) {
      getErrorMessage(err);
    }
  };

  const isLoading = registrationStatus === "loading";

  return (
    <Flex style={{ minHeight: "100dvh", width: "100%" }}>
      <Flex
        vertical
        style={{ textAlign: "center", width: "100%", padding: 24 }}
      >
        <Title level={1}>Создать учетную запись</Title>

        {error && (
          <Error message={error} onClose={() => dispatch(clearError())} />
        )}

        <Form
          layout="vertical"
          form={form}
          onFinish={handleRegister}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="login"
            label="Логин"
            rules={[{ required: true, message: "Введите логин" }]}
          >
            <Input placeholder="login" />
          </Form.Item>
          <Form.Item
            name="username"
            label="Имя пользователя"
            rules={[{ required: true, message: "Введите имя" }]}
          >
            <Input placeholder="username" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Введите корректный email",
              },
            ]}
          >
            <Input placeholder="email@example.com" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Пароль"
            rules={[{ required: true, message: "Введите пароль" }]}
          >
            <Input.Password placeholder="*********" />
          </Form.Item>
          <Form.Item name="phoneNumber" label="Телефон">
            <Input placeholder="+7 999 999 99 99" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} block>
              Зарегистрироваться
            </Button>
          </Form.Item>
        </Form>

        <Text type="secondary">
          Уже есть аккаунт?
          <Link to="/login" style={{ marginLeft: 8 }}>
            Войти
          </Link>
        </Text>
      </Flex>
    </Flex>
  );
}
