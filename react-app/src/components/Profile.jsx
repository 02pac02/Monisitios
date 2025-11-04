import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingScreen from "./LoadingScreen.jsx";

const Profile = () => {
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.post("http://localhost:8000/api/user", {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);
        setFormState(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put("http://localhost:8000/api/user", formState, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setUserData(formState);
        setIsEditing(false);
        setSuccessMessage("Datos actualizados correctamente.");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        console.error("Error updating user data");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handlePasswordSaveClick = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:8000/api/user/change-password", passwordForm, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setPasswordForm({
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        });
        setPasswordError("");
        setSuccessMessage("Contraseña actualizada correctamente.");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setPasswordError(response.data.message);
      }
    } catch (error) {
      setPasswordError("Error updating password");
    }
  };

  return (
    <div className="container mt-5 monitores">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="div-titulo">
          <span className="text-center">
            <b>Perfil</b>
          </span>
        </div>
      </div>
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="row">
          <div className="col-md-6">
          <h2>Datos</h2>
            {successMessage && <p className="text-success">{successMessage}</p>}
            {isEditing ? (
              <div>
                <div className="mb-3">
                  <label className="form-label">Nombre de usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formState.email}
                    onChange={handleInputChange}
                  />
                </div>
                <button className="btn btn-apli" onClick={handleSaveClick}>
                  Guardar
                </button>
              </div>
            ) : (
              <div>
                <p>Nombre de usuario: {userData.name}</p>
                <p>Email: {userData.email}</p>
                <button className="btn btn-apli" onClick={handleEditClick}>
                  Editar
                </button>
              </div>
            )}
          </div>

          <div className="col-md-6">
            <h2>Cambiar Contraseña</h2>
            <div className="mb-3">
              <label className="form-label">Contraseña Actual</label>
              <input
                type="password"
                className="form-control"
                name="current_password"
                value={passwordForm.current_password}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Nueva Contraseña</label>
              <input
                type="password"
                className="form-control"
                name="new_password"
                value={passwordForm.new_password}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirmar Nueva Contraseña</label>
              <input
                type="password"
                className="form-control"
                name="new_password_confirmation"
                value={passwordForm.new_password_confirmation}
                onChange={handlePasswordChange}
              />
            </div>
            {passwordError && <p className="text-danger">{passwordError}</p>}
            <button className="btn btn-apli" onClick={handlePasswordSaveClick}>
              Cambiar Contraseña
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
