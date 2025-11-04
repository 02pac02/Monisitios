// src/components/Footer.jsx

import React from 'react';

const Footer = () => {
    return (
        <footer style={styles.footerContainer}>
            <div style={styles.footerContent}>
                <p>&copy; {new Date().getFullYear()} MoniSitios. Todos los derechos reservados.</p>
                <div style={styles.socialMedia}>
                    <a href="https://facebook.com" style={styles.socialLink}>Facebook</a>
                    <a href="https://twitter.com" style={styles.socialLink}>Twitter</a>
                    <a href="https://instagram.com" style={styles.socialLink}>Instagram</a>
                </div>
            </div>
        </footer>
    );
};

const styles = {
    footerContainer: {
        marginTop: '10%',
        backgroundColor: '#333',
        color: '#fff',
        padding: '20px 0',
        textAlign: 'center',
    },
    footerContent: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'column',
    },
    socialMedia: {
        marginTop: '10px',
    },
    socialLink: {
        color: '#fff',
        margin: '0 10px',
        textDecoration: 'none',
    }
};

export default Footer;
