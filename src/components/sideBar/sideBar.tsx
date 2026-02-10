import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Typography, Menu } from "antd";

const { Title } = Typography;

const Sidebar: React.FC = () => {
  const menuItems = useMemo(
    () => [
      {
        key: "todo",
        label: <Link to="/">Список задач</Link>,
      },
      {
        key: "profile",
        label: <Link to="/profile">Личный кабинет</Link>,
      },
    ],
    []
  );

  return (
    <div
      style={{
        width: 240,
        backgroundColor: "#ffffffff",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        boxShadow: "2px 0 10px rgba(0, 0, 0, 0.2)",
        padding: "20px 0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: "0 16px", marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0, color: "#000000ff" }}>
          Sidebar
        </Title>
      </div>

      <Menu mode="inline" items={menuItems} style={{}} />
    </div>
  );
};

export default Sidebar;
