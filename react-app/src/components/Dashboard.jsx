import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import CheckWebsite from './CheckWebsite.jsx';
import Grafica from './Grafica.jsx';
import UrlController from './UrlController.jsx';
import LoadingScreen from './LoadingScreen.jsx';
import Footer from './Footer.jsx';
import Forbidden from './Forbidden.jsx';
import Profile from './Profile.jsx';
import MainView from './MainView.jsx';
import ConfirmationModal from './ConfirmationModal.jsx';

const Dashboard = () => {
    const [graphData, setGraphData] = useState(null);
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/grafica", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setGraphData(data);
            } catch (error) {
                console.error('Error fetching graph data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGraphData();

        const intervalId = setInterval(fetchGraphData, 60000);

        return () => clearInterval(intervalId);
    }, []);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="" element={<MainView />} />
                <Route path="monitores" element={<UrlController />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="new-website" element={<CheckWebsite />} />
                <Route path="website-checks/:id" element={<Grafica graphData={graphData} />} />
                {/* Ruta comodín */}
                <Route path="/*" element={<NotFound />} />
            </Routes>
            <Footer />
        </div>
    );
};

function NotFound() {
    return <Forbidden />; // Mostrar Forbidden en lugar de Navigate para garantizar que el componente esté montado
}

export default Dashboard;
