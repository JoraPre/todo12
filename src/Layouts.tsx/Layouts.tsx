import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sideBar/sideBar";

export const AppLayout: React.FC = () => {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
};

export const RootLayout: React.FC = () => {
  return <Outlet />;
};
