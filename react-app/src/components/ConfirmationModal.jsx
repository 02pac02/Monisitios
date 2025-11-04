import React from "react";

const ConfirmationModal = ({ show, message, onConfirm, onCancel }) => {
  const modalClassName = show ? "modal show" : "modal";

  return (
    <div className={modalClassName}>
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="btn btn-apli" onClick={onConfirm}>
            Confirmar
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
