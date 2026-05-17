import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardPage from "./PAges/LoginPage";
import DashboardPage from "./PAges/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
