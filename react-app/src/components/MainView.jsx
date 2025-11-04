import React from "react";

const MainView = () => {
  return (
    <div className="container3">
      <div className="contenido-principal">
        <h2>Bienvenido a MoniSitios</h2>
        <p>
          El proyecto "MoniSitio" ofrece una plataforma web donde los usuarios
          pueden supervisar en tiempo real el rendimiento y la disponibilidad de
          sus sitios web, recibiendo alertas instantáneas sobre cualquier
          problema detectado para asegurar un funcionamiento óptimo.
        </p>
      </div>
      <div className="contenido-secundario">
        <h2>Comienza ahora!!!</h2>
        <button className="btn btn-apli-invert">
          <a className="nav-link" href={"/dashboard/new-website"}>
            <i className="fa-solid fa-square-plus"></i> Agregar Monitor
          </a>
        </button>
      </div>
    </div>
  );
};

export default MainView;
