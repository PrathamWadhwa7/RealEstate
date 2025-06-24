// src/services/api.js (updated)
import axios from 'axios';

const API_BASE_URL = 'https://your-api-endpoint.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const getProperties = async (params = {}) => {
  try {
    const response = await api.get('/properties', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export const getNearbyProperties = (lng, lat, distance) => {
  return axios.get(`/api/properties/nearby?lng=${lng}&lat=${lat}&distance=${distance}`);
};

export const getAllProperties = (params = {}) => {
  return axios.get('/api/properties', { params });
};

export const getPropertyById = async (id) => {
  try {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching property:', error);
    throw error;
  }
};

export const getLocalities = async () => {
  try {
    const response = await api.get('/localities');
    return response.data;
  } catch (error) {
    console.error('Error fetching localities:', error);
    throw error;
  }
};

export const submitContactForm = async (formData) => {
  try {
    const response = await api.post('/contact', formData);
    return response.data;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};