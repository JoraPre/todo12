import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/sideBar/SideBar";

export const AppLayout: React.FC = () => {
  return (
    <>
      <SideBar />
      <div style={{ marginLeft: 240 }}>
        <Outlet />
      </div>
    </>
  );
};

export const RootLayout: React.FC = () => {
  return <Outlet />;
};
