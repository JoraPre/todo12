import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Flex, message, Button } from "antd";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { logoutUser, fetchProfile } from "../../../store/authStore";

const { Title, Text } = Typography;

export const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/auth?mode=signin");
    } catch (error) {
      console.error("Logout failed:", error);
      messageApi.error("Не удалось выйти. Попробуйте снова.");
    }
  };

  return (
    <>
      {contextHolder}
      <Title level={1}>Привет!</Title>
      <Flex
        vertical
        gap="small"
        style={{ maxWidth: "400px", margin: "0 auto" }}
      >
        <Title level={3}>Личный кабинет</Title>
        <Flex
          justify="space-between"
          style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Имя пользователя
          </Title>
          <Text>{user?.username}</Text>
        </Flex>
        <Flex
          justify="space-between"
          style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Почтовый адрес
          </Title>
          <Text>{user?.email}</Text>
        </Flex>
        <Flex
          justify="space-between"
          style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Телефон
          </Title>
          <Text>{user?.phoneNumber || "Не указан"}</Text>
        </Flex>
        <Button danger onClick={handleLogout} style={{ marginTop: "20px" }}>
          Выйти
        </Button>
      </Flex>
    </>
  );
};
