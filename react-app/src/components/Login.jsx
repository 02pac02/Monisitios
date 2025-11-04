import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
// import { useUser } from "./UserContext";
// import Navbar from "./Navbar";
import MensajeError from "./MensajeError.jsx";
import FormData from "./FormData.jsx";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // const { setUserData } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.errors || "Credenciales incorrectas");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.custom_token); // Almacena el token de acceso en el almacenamiento local


      navigate("/dashboard"); // Redirigir al dashboard después de iniciar sesión
    } catch (error) {
      console.error("Error:", error);
      setError("Error en la solicitud");
    }
  };

  return (
    <div className="container2">
      <div className="login-box">
        <FormData />
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-apli btn-login" type="submit">
            Loguearse
          </button>
          <link></link>
          <Link to="/register" className="btn btn-apli btn-login btn-2">
            Registrarse
          </Link>
        </form>
        {error && <MensajeError error={error} />}
      </div>
    </div>
  );
};

export default Login;
