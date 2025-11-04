import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/styles.scss';
import App from './App.jsx';

//Suprime advertencias de React en producción
if (process.env.NODE_ENV === 'production') {
  console.log = function() {};
  console.warn = function() {};
  console.error = function() {};
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
