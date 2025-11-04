// UserContext.jsx
import React, { createContext, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const setDecodedUser = (decodedToken) => {
    setUser(decodedToken);
  };

  return (
    <UserContext.Provider value={{ user, setDecodedUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
