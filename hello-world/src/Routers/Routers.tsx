import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TodoPage } from "../pages/TodoPage/Todoppage";
import { ProfilePage } from "./profilePages";
import { Layout } from "antd";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import styles from "./rout.module.css";

const { Header, Sider } = Layout;

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout className={styles.layout}>
        <div>
          <Menu>
            <Menu.Item key="todo">
              <Link to="/">Список задач</Link>
            </Menu.Item>
            <Menu.Item key="profile">
              <Link to="/profile">Профиль</Link>
            </Menu.Item>
          </Menu>
        </div>
        <Sider className={styles.sider}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%" }}
          />
        </Sider>
        <Layout>
          <Header className={styles.header} />

          <div>
            <Routes>
              <Route path="/" element={<TodoPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};
