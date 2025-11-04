import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import FormData from "./FormData";
import MensajeError from "./MensajeError.jsx";
import FormData from "./FormData.jsx";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmed: "",
    role_id: "3", // Establece el valor predeterminado de role_id en 3
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error en la respuesta:", errorText);
        setError("Error en el registro");
        return;
      }

    //   const data = await response.json();
    //   localStorage.setItem("token", data.jwt);
      navigate("/login"); // Redirigir al dashboard después de iniciar sesión
    } catch (error) {
      console.error("Error:", error);
      setError("Error en la solicitud");
    }
  };

  return (
    <div className="container2">
      <div className="login-box">
        <h2>Registro</h2>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirmar Contraseña:</label>
            <input
              type="password"
              name="password_confirmed"
              value={formData.password_confirmed}
              onChange={handleChange}
              required
            />
          </div>
          {/* <div>
                    <label>Role ID:</label>
                    <input
                        type="text"
                        name="role_id"
                        value={formData.role_id}
                        onChange={handleChange}
                        required
                    />
                </div> */}
          <button className="btn btn-apli btn-login" type="submit">
            Registrarse
          </button>
          <Link to="/login" className="btn btn-apli btn-login btn-2">
            Login
          </Link>
        </form>
        {error && <MensajeError error={error} />}
      </div>
    </div>
  );
};

export default Register;
