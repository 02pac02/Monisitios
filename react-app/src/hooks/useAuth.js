// src/hooks/useAuth.js

import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

export const useAuth = () => {
  const { user, setUser } = useContext(UserContext);
  return { user, setUser };
};
