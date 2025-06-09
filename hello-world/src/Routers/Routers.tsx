import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { TodoPage } from "../pages/TodoPage/Todoppage";
import { ProfilePage } from "./profilePages";

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Список задач</Link>
            </li>
            <li>
              <Link to="/profile">Профиль</Link>
            </li>
          </ul>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<TodoPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};
