import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes, Route, Navigate,
} from "react-router-dom";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Dashboard from "./components/Dashboard.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Forbidden from './components/Forbidden.jsx';

function App() {
    /*useEffect(() => {
        if (window.location.hostname === '127.0.0.1' && window.location.port === '3000') {
          window.location.href = 'http://monisitios.com';
        }
      }, []);*/
    return (
        <Router>
            <Routes>
                <Route path="/" element={<PrivateRoute />}>
                    <Route index element={<Navigate to="/dashboard" />} />
                    <Route path="/dashboard/*" element={<Dashboard />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/403" element={<Forbidden />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

function NotFound() {
    return <Navigate to="/403" />;
}

export default App;
