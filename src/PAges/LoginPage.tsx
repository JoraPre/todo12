import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { loginThunk } from "../store/auth/slices/authSlice";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const result = await dispatch(loginThunk({ login, password }));
    if (loginThunk.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  return (
    <div>
      <h1>Logsin</h1>

      <input
        placeholder="login"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Загрузка..." : "Login"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default LoginPage;
