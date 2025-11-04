import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ConfirmationModal from "./ConfirmationModal.jsx";

const URLList = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.data.user_id);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }

    const fetchUrls = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/urls", {
          params: {
            user_id: userId,
          },
        });
        setUrls(response.data.urls);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching URLs:", error);
        setLoading(false);
      }
    };

    if (userId) {
      fetchUrls();
      const intervalId = setInterval(fetchUrls, 60000);
      return () => clearInterval(intervalId);
    }
  }, [userId]);

  const reloadUrls = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/urls", {
        params: {
          user_id: userId,
        },
      });

      setUrls(response.data.urls);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching URLs:", error);
      setLoading(false);
    }
  };

  const getTimeDifference = (createdAt) => {
    const now = new Date();
    const createdAtDate = new Date(createdAt);
    const difference = Math.abs(now - createdAtDate);
    const minutesDifference = Math.floor(difference / (1000 * 60));

    if (minutesDifference < 1) {
      return "hace unos segundos";
    } else if (minutesDifference === 1) {
      return "hace 1 minuto";
    } else {
      return `hace ${minutesDifference} minutos`;
    }
  };

  const handleDeleteUrl = async (urlId) => {
    setUrlToDelete(urlId);
    setShowConfirmationModal(true);
  };

  const confirmDeleteUrl = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/urls/${urlToDelete}`
      );
      if (response.status === 200) {
        // console.log(`URL con ID ${urlToDelete} borrada exitosamente`);
        reloadUrls();
      } else {
        console.error(`Error borrando la URL con ID ${urlToDelete}`);
      }
    } catch (error) {
      console.error(`Error borrando la URL con ID ${urlToDelete}:`, error);
    } finally {
      setShowConfirmationModal(false);
    }
  };

  const cancelDeleteUrl = () => {
    setShowConfirmationModal(false);
  };

  const filteredUrls = urls.filter((url) =>
    url.url.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // setShowConfirmationModal(true);
  // console.log(showConfirmationModal)
  // console.log(confirmDeleteUrl)
  // console.log(cancelDeleteUrl)
  return (
    <div className="container mt-5 monitores">
      <ConfirmationModal
        show={showConfirmationModal}
        onConfirm={confirmDeleteUrl}
        onCancel={cancelDeleteUrl}
        message="¿Estás seguro que deseas borrar esta URL?"
      />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="div-titulo">
          <span className="text-center">
            <b>Monitores</b>
          </span>
        </div>
      </div>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control buscador"
          placeholder="Buscar monitor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="btn btn-apli d-inline-flex align-items-center px-2 py-1"
          onClick={reloadUrls}
        >
          <span className="material-icons">refresh</span>
        </button>
      </div>
      <div className="table-responsive tabla">
        <table className="tabla2">
          <thead>
            <tr>
              <th>Nombre del monitor</th>
              <th className="d-none d-md-table-cell">Funcionamiento</th>
              <th className="d-none d-md-table-cell">Último sondeo</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredUrls.length === 0 ? (
              <tr>
                <td colSpan="4">
                  No hay todavía monitores registrados.{" "}
                  <a className="nav-link" href={"/dashboard/new-website"}>
                    <i className="fa-solid fa-square-plus"></i> Agregar Monitor
                  </a>
                </td>
              </tr>
            ) : (
              filteredUrls.map((url) => (
                <tr key={url.id}>
                  <td>{url.url}</td>
                  <td className="d-none d-md-table-cell">
                    {url.checks[0].load_time} ms
                  </td>
                  <td className="d-none d-md-table-cell">
                    {getTimeDifference(url.checks[0].created_at)}
                  </td>
                  <td>
                    <Link
                      to={`/dashboard/website-checks/${url.id}`}
                      className="text-decoration-none"
                    >
                      <div className="btn btn-apli d-inline-flex align-items-center px-2 py-1">
                        <span className="material-icons">visibility</span>
                      </div>
                    </Link>
                  </td>
                  <td>
                    <div
                      className="btn btn-apli d-inline-flex align-items-center px-2 py-1"
                      onClick={() => {
                        setUrlToDelete(url.id);
                        setShowConfirmationModal(true);
                      }}
                    >
                      <span className="material-icons">delete</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default URLList;
