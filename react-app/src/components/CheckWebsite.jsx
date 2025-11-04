import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./CheckWebsiteForm.css"; // Estilos CSS personalizados
import LoadingScreen from "./LoadingScreen.jsx";

const CheckWebsiteForm = () => {
  const [htmlContent, setHtmlContent] = useState("");
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    user_id: 0,
    url: "",
    interval: 300,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserData(decoded.data);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (userData) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        user_id: userData.user_id,
      }));
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/nuevaweb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorMessage = `Error: ${response.status} - ${response.statusText}`;
        throw new Error(errorMessage);
      }
      const data = await response.text();
      setHtmlContent(data);
    } catch (error) {
      console.error("Error:", error);
      setError("Error en la solicitud");
    }
  };

  if (!userData) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mt-5 monitores">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="div-titulo">
          <span className="text-center">
            <b>Nuevo Monitor</b>
          </span>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8">
          <form className="check-website-form" onSubmit={handleSubmit}>
            <div className="bien" dangerouslySetInnerHTML={{ __html: htmlContent }} />
            <input
              type="hidden"
              id="user_id"
              name="user_id"
              value={formData.user_id}
            />
            {/* Campo de la URL */}
            <div className="form-group">
              <label htmlFor="url">URL:</label>
              <input
                type="text"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                required
              />
            </div>
            {/* Campo del intervalo */}
            <div className="form-group">
              <label htmlFor="interval">Intervalo (minutos):</label>
              <select
                id="interval"
                name="interval"
                value={formData.interval}
                onChange={handleChange}
                required
              >
                {[5, 10, 15, 20, 25, 30].map((minutes) => (
                  <option key={minutes} value={minutes * 60}>
                    {minutes} minutos
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-apli">
              Verificar
            </button>
            {error && <div className="error">Error: {error}</div>}
          </form>
        </div>
        <div className="col-md-4">
          <div className="info-box">
            <h5>Información del Monitor</h5>
            <p>
              Para poder agregar un nuevo monitor, debes de tener la URL a la
              cual se le va a realizar las pruebas.
            </p>
            <p>
              El intervalo es el tiempo en el cual se van a realizar las
              comprobaciones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckWebsiteForm;
