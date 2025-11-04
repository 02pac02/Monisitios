import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min';
// import '@fortawesome/fontawesome-free/css/all.min.css';
import LogoutButton from "./LogoutButton.jsx";
import ProfileButton from "./ProfileButton.jsx";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <a className="navbar-brand navbar_nombrelogo" href={"/"}>
          <img src={"../../img/logo128x128.png"} alt="Logo" className="logo" />
          MoniSitios
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href={"/"}>
                <i className="fa-solid fa-igloo"></i> Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href={"/dashboard/monitores"}>
                <i className="fa-brands fa-watchman-monitoring"></i> Monitores
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href={"/dashboard/new-website"}>
                <i className="fa-solid fa-square-plus"></i> Agregar Monitor
              </a>
            </li>
          </ul>
          {/* <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Buscar..."
              aria-label="Buscar"
            />
            <button className="btn btn-apli" type="submit">
              <b>
                <i className="fa-solid fa-magnifying-glass"></i>
              </b>
            </button>
          </form> */}

          {isLoggedIn ? (
            <>
              <ProfileButton />
              <LogoutButton />
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
