// ProfilePage.js

import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const ProfilePage = () => {
  // Accede al contexto de usuario
  const { user } = useContext(UserContext);

  return (
    <div>
      {user ? (
        <div>
          <h2>Perfil de usuario</h2>
          <p>ID: {user.id}</p>
          <p>Email: {user.email}</p>
          {/* Otros datos del usuario */}
        </div>
      ) : (
        <p>No hay usuario autenticado</p>
      )}
    </div>
  );
};

export default ProfilePage;
