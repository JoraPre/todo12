import React, { useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Form, Button, Input, Typography, Row, Col, message } from "antd";
import {
  usernameRules,
  loginRules,
  passwordRules,
  confirmPasswordRules,
  emailRules,
  phoneNumberRules,
} from "../../validationRules/validationRules";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { login, register } from "../../store/authStore";
import type { UserLogin, UserRegistration } from "../../types/auth";
import authImage from "../../img/auth.png";

const { Title } = Typography;

type SignInFields = {
  login: string;
  password: string;
};

type SignUpFields = SignInFields & {
  username: string;
  email: string;
  phoneNumber: string;
  confirmPassword: string;
};

type FieldType = SignInFields | SignUpFields;

const AuthForm: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm<FieldType>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.auth);

  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "signin";
  const isSubmitting = status === "loading";

  useEffect(() => {
    if (status === "failed" && error) {
      messageApi.error(error);
    }
  }, [status, error, messageApi]);

  const handleSubmit = async (values: FieldType) => {
    if (isLogin) {
      const result = await dispatch(login(values as UserLogin));
      if (login.fulfilled.match(result)) {
        navigate("/");
      }
    } else {
      const signUpValues = values as SignUpFields;
      const registrationData: UserRegistration = {
        login: signUpValues.login,
        username: signUpValues.username,
        password: signUpValues.password,
        email: signUpValues.email,
      };
      if (signUpValues.phoneNumber?.trim()) {
        registrationData.phoneNumber = "+" + signUpValues.phoneNumber;
      }

      const result = await dispatch(register(registrationData));
      if (register.fulfilled.match(result)) {
        messageApi.success("Успешно зарегистрировано!");
        form.resetFields();
      }
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f7fa",
        padding: "20px",
      }}
    >
      {contextHolder}

      <div
        style={{
          display: "flex",
          width: "100%",
          maxWidth: "1000px",
          minHeight: "600px",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
          backgroundColor: "#fff",
        }}
      >
        <div
          style={{
            width: "50%",
            backgroundImage: `url(${authImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div
          style={{
            width: "50%",
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            style={{ width: "100%", maxWidth: 400 }}
          >
            <Title level={2}>{isLogin ? "Вход" : "Регистрация"}</Title>

            <Col>
              {isLogin ? (
                <>
                  <Form.Item<SignInFields>
                    name="login"
                    label="Логин"
                    rules={loginRules}
                  >
                    <Input placeholder="Введите логин" />
                  </Form.Item>
                  <Form.Item<SignInFields>
                    name="password"
                    label="Пароль"
                    rules={passwordRules}
                  >
                    <Input.Password placeholder="Введите пароль" />
                  </Form.Item>
                </>
              ) : (
                <>
                  <Form.Item<SignUpFields>
                    name="username"
                    label="Имя пользователя"
                    rules={usernameRules}
                  >
                    <Input placeholder="Введите имя пользователя" />
                  </Form.Item>
                  <Form.Item<SignUpFields>
                    name="login"
                    label="Логин"
                    rules={loginRules}
                  >
                    <Input placeholder="Введите логин" />
                  </Form.Item>
                  <Form.Item<SignUpFields>
                    name="password"
                    label="Пароль"
                    rules={passwordRules}
                  >
                    <Input.Password placeholder="Введите пароль" />
                  </Form.Item>
                  <Form.Item<SignUpFields>
                    name="confirmPassword"
                    label="Подтвердите пароль"
                    dependencies={["password"]}
                    rules={confirmPasswordRules}
                  >
                    <Input.Password placeholder="Подтвердите пароль" />
                  </Form.Item>
                  <Form.Item<SignUpFields>
                    name="email"
                    label="Email"
                    rules={emailRules}
                  >
                    <Input placeholder="Введите email" />
                  </Form.Item>
                  <Form.Item<SignUpFields>
                    name="phoneNumber"
                    label="Телефон"
                    rules={phoneNumberRules}
                  >
                    <Input addonBefore="+" placeholder="Введите номер телефона" />
                  </Form.Item>
                </>
              )}

              <Row gutter={16}>
                <Col span={12}>
                  <Button type="link" block>
                    <Link to={`?mode=${isLogin ? "signup" : "signin"}`}>
                      {isLogin ? "Зарегистрироваться" : "Войти"}
                    </Link>
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    type="primary"
                    block
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    htmlType="submit"
                  >
                    {isLogin ? "Войти" : "Зарегистрироваться"}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
