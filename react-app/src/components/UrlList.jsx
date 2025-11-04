import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const UrlList = () => {
    const [urls, setUrls] = useState([]);

    useEffect(() => {
        const fetchUrls = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/urls");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setUrls(data);
            } catch (error) {
                console.error('Error fetching URLs:', error);
            }
        };
        fetchUrls();
    }, []);

    return (
        <div>
            <h1>Lista de URLs</h1>
            <ul>
                {urls.map((url) => (
                    <li key={url.id}>
                        <Link to={`/urls/${url.id}`}>{url.url}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UrlList;
