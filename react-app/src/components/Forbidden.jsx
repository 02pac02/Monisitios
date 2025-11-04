import React from 'react';
import { Link } from 'react-router-dom';
import './Forbidden.css'; // Importa el CSS

function Forbidden() {
  return (
    <div className="forbidden-container"> {/* Aplica la clase aquí */}
      <h1>403 Forbidden</h1>
      <p>Lo siento, no tienes permiso para acceder a esta página.</p>
      <Link to="/">Volver al Inicio</Link>
    </div>
  );
}

export default Forbidden;
