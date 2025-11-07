import axios from "axios";

/**
 * @file ApiRequest.js
 * @module ApiRequest
 * @description
 * Centralized API handler for all HTTP requests.
 * Automatically includes JWT token (if available in localStorage)
 * in the Authorization header for secure endpoints.
 */

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

/**
 * @function requestInterceptor
 * @description
 * Attaches JWT token to the Authorization header for every outgoing request.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * @function responseInterceptor
 * @description
 * Handles unauthorized (401) responses globally and logs out user if needed.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized — token may be missing or expired.");
      // Optionally, clear storage and redirect:
      // localStorage.removeItem("token");
      // window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// --- Reusable typed requests ---
export const api = {
  /**
   * GET request
   * @param {string} endpoint - API endpoint (relative path)
   * @param {Object} [params] - Query parameters
   * @returns {Promise<any>} Response data
   */
  get: async (endpoint, params = {}) => {
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  },

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} [body] - Request body
   * @returns {Promise<any>} Response data
   */
  post: async (endpoint, body = {}) => {
    const response = await apiClient.post(endpoint, body);
    return response.data;
  },

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} [body] - Request body
   * @returns {Promise<any>} Response data
   */
  put: async (endpoint, body = {}) => {
    const response = await apiClient.put(endpoint, body);
    return response.data;
  },

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} [params] - Query parameters
   * @returns {Promise<any>} Response data
   */
  delete: async (endpoint, params = {}) => {
    const response = await apiClient.delete(endpoint, { params });
    return response.data;
  },
};

export default api;
