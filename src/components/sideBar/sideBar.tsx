import React from "react";
import { Link } from "react-router-dom";
import { Typography, Menu } from "antd";

const { Title } = Typography;

const menuItems = [
  {
    key: "todo",
    label: <Link to="/">Список задач</Link>,
  },
  {
    key: "profile",
    label: <Link to="/profile">Личный кабинет</Link>,
  },
];

const SideBar: React.FC = () => {
  return (
    <Menu
      mode="inline"
      items={menuItems}
      style={{
        width: 240,
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        boxShadow: "2px 0 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div style={{ padding: "20px 16px 16px" }}>
        <Title level={4} style={{ margin: 0 }}>
          Навигация
        </Title>
      </div>
    </Menu>
  );
};

export default SideBar;
