import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { usePermissions } from "../helpers/usePermissions";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

export const AppLayout = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const location = useLocation();
  const { canModerate } = usePermissions();

  const items: MenuItem[] = [
    {
      key: "/todo",
      label: (
        <NavLink to="/todo" end>
          Список задач
        </NavLink>
      ),
    },
    {
      key: "/profile",
      label: (
        <NavLink to="/profile" end>
          Профиль
        </NavLink>
      ),
    },
  ];

  if (canModerate) {
    items.push({
      key: "/users",
      label: (
        <NavLink to="/users" end>
          Пользователи
        </NavLink>
      ),
    });
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {}
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
        />
      </Sider>

      <Layout>
        <Header style={{ padding: 0 }} />

        {}
        <Content style={{ padding: 24 }}>
          <Outlet /> {}
        </Content>

        <Footer />
      </Layout>
    </Layout>
  );
};

export default AppLayout;
