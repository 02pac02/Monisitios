// src/services/authService.js

import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  if (response.data.custom_token) { // Ajusta según el nombre de tu nuevo token
    localStorage.setItem('token', response.data.custom_token); // Ajusta según el nombre de tu nuevo token
  }
  return response.data;
};

export const fetchUser = async (token) => {
  try {
    const response = await axios.post(`${API_URL}/user`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los datos del usuario: ' + error.message);
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};
