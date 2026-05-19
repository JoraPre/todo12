import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Button, Typography } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAppDispatch } from "../hooks";
import { logout } from "../store/auth/slices/authSlice";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface AppLayoutProps {
  children: React.ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Дашборд",
    },
    {
      key: "/users",
      icon: <TeamOutlined />,
      label: "Пользователи",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!collapsed && (
            <Title level={5} style={{ color: "#fff", margin: 0 }}>
              Admin Panel
            </Title>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Button icon={<LogoutOutlined />} danger onClick={handleLogout}>
            Выйти
          </Button>
        </Header>

        <Content style={{ margin: 24 }}>{children}</Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
