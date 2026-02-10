import React, { useEffect } from "react";
import {
  Link,
  useSearchParams,
  useNavigation,
  useSubmit,
  useActionData,
} from "react-router-dom";
import { Form, Button, Input, Typography, Row, Col, message } from "antd";
import {
  usernameRules,
  loginRules,
  passwordRules,
  confirmPasswordRules,
  emailRules,
  phoneNumberRules,
} from "../../validationRules/validationRules1";
import authImage from "../../imggg/authhh.png";

const { Title } = Typography;

type FieldType = {
  login: string;
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  confirmPassword: string;
};

const AuthenticationPage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const navigation = useNavigation();
  const submit = useSubmit();
  const actionData: { success: boolean; message: string } | undefined =
    useActionData();
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "signin";
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (actionData) {
      messageApi.open({
        type: actionData.success ? "success" : "error",
        content: actionData.message,
        duration: actionData.success ? 10 : 5,
      });
      if (actionData.success) {
        form.resetFields();
      }
    }
  }, [actionData, messageApi, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      submit(values, {
        method: "post",
        action: `/auth?mode=${isLogin ? "signin" : "signup"}`,
      });
    } catch (errorInfo) {
      console.log("Validation Failed:", errorInfo);
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
          height: "810%",
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
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            textAlign: "center",
            padding: "20px",
            position: "relative",
          }}
        ></div>

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
            validateTrigger="onFinish"
            layout="vertical"
            className="form"
            style={{ width: "100%", maxWidth: 400 }}
          >
            <Title level={2}>{isLogin ? "Вход" : "Регистрация"}</Title>
            <Col>
              {isLogin ? (
                <>
                  <Form.Item<FieldType>
                    name="login"
                    label="Логин"
                    rules={loginRules}
                  >
                    <Input placeholder="Введите логин" />
                  </Form.Item>
                  <Form.Item<FieldType>
                    name="password"
                    label="Пароль"
                    rules={passwordRules}
                  >
                    <Input.Password placeholder="Введите пароль" />
                  </Form.Item>
                </>
              ) : (
                <>
                  <Form.Item<FieldType>
                    name="username"
                    label="Имя пользователя"
                    rules={usernameRules}
                  >
                    <Input placeholder="Введите имя пользователя" />
                  </Form.Item>
                  <Form.Item<FieldType>
                    name="login"
                    label="Логин"
                    rules={loginRules}
                  >
                    <Input placeholder="Введите логин" />
                  </Form.Item>
                  <Form.Item<FieldType>
                    name="password"
                    label="Пароль"
                    rules={passwordRules}
                  >
                    <Input.Password placeholder="Введите пароль" />
                  </Form.Item>
                  <Form.Item<FieldType>
                    name="confirmPassword"
                    label="Подтвердите пароль"
                    dependencies={["password"]}
                    rules={confirmPasswordRules}
                  >
                    <Input.Password placeholder="Подтвердите пароль" />
                  </Form.Item>
                  <Form.Item<FieldType>
                    name="email"
                    label="Email"
                    rules={emailRules}
                  >
                    <Input placeholder="Введите email" />
                  </Form.Item>
                  <Form.Item<FieldType>
                    name="phoneNumber"
                    label="Телефон"
                    rules={phoneNumberRules}
                  >
                    <Input
                      addonBefore="+"
                      placeholder="Введите номер телефона"
                    />
                  </Form.Item>
                </>
              )}
              <div className="actions">
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
                      disabled={isSubmitting}
                      htmlType="submit"
                    >
                      {isSubmitting
                        ? "Отправка..."
                        : isLogin
                        ? "Войти"
                        : "Зарегистрироваться"}
                    </Button>
                  </Col>
                </Row>
              </div>
            </Col>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;
