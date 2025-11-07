import axios from "axios";

/**
 * Base URL for the API requests
 */
const API_BASE_URL = "http://localhost:4000/api";

/**
 * Axios instance with base URL and default headers
 * Used for making API requests throughout the application
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// --- Reusable typed requests ---
export const api = {
  // GET request
  get: async (endpoint, params = {}) => {
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  },

  // POST request
  post: async (endpoint, body = {}) => {
    const response = await apiClient.post(endpoint, body);
    return response.data;
  },

  // PUT request
  put: async (endpoint, body = {}) => {
    const response = await apiClient.put(endpoint, body);
    return response.data;
  },

  // DELETE request
  delete: async (endpoint, params = {}) => {
    const response = await apiClient.delete(endpoint, { params });
    return response.data;
  },
};

export default api;