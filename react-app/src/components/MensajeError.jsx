import React, { useState, useEffect } from 'react';

const MensajeError = ({ error }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (error) {
      // Cerrar automáticamente después de 5 segundos si hay error
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);

      // Limpia el temporizador cuando el componente se desmonta o cuando visible cambia a false
      return () => clearTimeout(timer);
    }
  }, [error]); // Se ejecuta cuando error cambia

  const handleClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si el clic no está dentro del componente, ocultarlo
      if (!event.target.closest(".mensaje-error")) {
        setVisible(false);
      }
    };

    // Agregar un event listener para clics en el documento
    document.addEventListener("click", handleClickOutside);

    // Limpiar el event listener cuando el componente se desmonta
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      {error && visible && (
        <div className="mensaje-error" onClick={handleClose}>
          <p style={{ color: "red" }}>{error}</p>
        </div>
      )}
    </>
  );
}

export default MensajeError;
