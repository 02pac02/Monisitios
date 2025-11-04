// LoginPage.js
import React, { useState, useContext } from "react";
import { jwtDecode } from "jwt-decode"; // Corrige la importación aquí
import { login } from "../services/authService";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setDecodedUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      const decodedToken = jwtDecode(response.custom_token);
      // console.log(decodedToken.data);
      //   setDecodedUser(decodedToken.data);
      navigate("/dashboard");
    } catch (error) {
      setError("Error en el inicio de sesión. Inténtalo de nuevo.");
      console.error("Error de inicio de sesión:", error);
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin}>Iniciar Sesión</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default LoginPage;
