import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("https://easydev.club/api/auth/signin", {
        login,
        password,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch {
      alert("error");
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <input
        placeholder="login"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />

      <input
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginPage;
