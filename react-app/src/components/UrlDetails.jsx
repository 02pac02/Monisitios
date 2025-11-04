import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UrlDetails = () => {
    const [url, setUrl] = useState(null);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchUrl = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/urls/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setUrl(data);
            } catch (error) {
                console.error('Error fetching URL details:', error);
                setError("Error fetching URL details");
            }
        };

        fetchUrl();
    }, [id]);

    if (!url) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>URL Details</h2>
            {error && <div>Error: {error}</div>}
            <p>ID: {url.id}</p>
            <p>URL: {url.url}</p>
            <p>Interval: {url.interval}</p>
        </div>
    );
};

export default UrlDetails;
