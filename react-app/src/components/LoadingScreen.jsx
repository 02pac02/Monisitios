import React from 'react';
import './LoadingScreen.css'; // Asegúrate de importar tu archivo de estilos

const LoadingScreen = () => {
    return (
        <div className="loading-container">
            <div className="spinner">
                <img src="../../img/logo128x128.png" alt="Logo" className="loading-image" />
            </div>
        </div>
    );
};

export default LoadingScreen;
