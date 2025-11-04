// src/components/UserProfile.jsx

import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const UserProfile = () => {
  const { user } = useContext(UserContext);

  return (
    <div>
      {user ? (
        <div>
          <h1>Bienvenido, {user.name}</h1>
          <p>Email: {user.email}</p>
          {/* Otros datos del usuario */}
        </div>
      ) : (
        <p>No estás autenticado.</p>
      )}
    </div>
  );
};

export default UserProfile;
