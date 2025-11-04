import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token"); // Obtener el token del almacenamiento local
      //   console.log(token);
      const response = await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token al encabezado de autorización
        },
      });
      //   console.log(response);

      if (response.status === 401) {
        console.error("No autorizado");
      } else if (!response.ok) {
        console.error("Error HTTP:", response.status);
      } else {
        localStorage.removeItem("token"); // Eliminar el token del almacenamiento local
        navigate("/login"); // Redirigir al usuario a la página de inicio de sesión
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  return (
    <div className="icon-container">
      <button className="btn btn-apli-invert btn-logout" onClick={handleLogout}>
        <span className="material-icons">power_settings_new</span>
      </button>
      <div className="hover-text">Cerrar Sesión</div>
    </div>
  );
};

export default LogoutButton;
