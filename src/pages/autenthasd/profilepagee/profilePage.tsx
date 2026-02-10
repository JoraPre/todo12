import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Flex, message, Button } from "antd";
import { getProfile, logout } from "../../../Api/apiclone1.tsx";
import type { Profile } from "../../../types/type.tsx";

const { Title, Text } = Typography;

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth?mode=signin");
    } catch (error) {
      console.error("Logout failed:", error);
      messageApi.error("Не удалось выйти. Попробуйте снова.");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setProfile(response);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        messageApi.error("Не удалось загрузить профиль. Войдите заново.");
        handleLogout();
      }
    };

    fetchProfile();
  }, [messageApi]);

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
          <Text>{profile?.username}</Text>
        </Flex>
        <Flex
          justify="space-between"
          style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Почтовый адрес
          </Title>
          <Text>{profile?.email}</Text>
        </Flex>
        <Flex
          justify="space-between"
          style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Телефон
          </Title>
          <Text>{profile?.phoneNumber || "Не указан"}</Text>
        </Flex>
        <Button danger onClick={handleLogout} style={{ marginTop: "20px" }}>
          Выйти
        </Button>
      </Flex>
    </>
  );
};
