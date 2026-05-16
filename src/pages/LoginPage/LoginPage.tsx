import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginThunk } from "../../store/auth/thunks/loginThunk";
import type { AuthData } from "../../types/typesAuth";
import { Checkbox, Form, Input, Typography, Button, Flex } from "antd";
import { clearError } from "../../store/auth/slices/authSlice";
import Error from "../../components/Error";
import { getErrorMessage } from "../../helpers/errorMessage";
import { fetchProfileThunk } from "../../store/auth/thunks/rolesThunk";

const { Title, Text } = Typography;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.auth);
  const [form] = Form.useForm();

  const handleLogin = async (values: AuthData) => {
    try {
      await dispatch(loginThunk(values)).unwrap();

      await dispatch(fetchProfileThunk()).unwrap();

      form.resetFields();
      navigate("/todo", { replace: true });
    } catch (err: unknown) {
      getErrorMessage(err);
    }
  };

  const isLoading = status === "loading";

  return (
    <Flex style={{ minHeight: "100dvh", width: "100%" }}>
      <Flex vertical style={{ textAlign: "center", width: "100%" }}>
        <Title level={1}>Login to your account</Title>
        <Text type="secondary">See what is going on with your business</Text>

        {}
        {error && (
          <Error message={error} onClose={() => dispatch(clearError())} />
        )}

        {}
        <Form
          layout="vertical"
          form={form}
          onFinish={handleLogin}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="login"
            label="Login"
            rules={[{ required: true, message: "Введите логин" }]}
          >
            <Input placeholder="login" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Введите пароль" }]}
          >
            <Input.Password placeholder="*********" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            {}
            <Button type="primary" htmlType="submit" loading={isLoading} block>
              Login
            </Button>
          </Form.Item>
        </Form>

        <Text type="secondary">
          Еще не зарегистрировались?
          <Link to="/registration" style={{ marginLeft: 8 }}>
            Создать учетную запись
          </Link>
        </Text>
      </Flex>
    </Flex>
  );
}
