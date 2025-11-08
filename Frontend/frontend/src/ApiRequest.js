import axios from "axios";

/**
 * @file ApiRequest.js
 * @module ApiRequest
 * @description
 * Centralized API handler for all HTTP requests.
 * Automatically includes JWT token (if available in localStorage)
 * in the Authorization header for secure endpoints.
 * Includes robust guards for Jest testing environments.
 */

/** Base URL for API requests */
const API_BASE_URL = "http://localhost:4000/api";

/**
 * Safely create an Axios instance.
 * If axios.create fails (like in mocked environments), fall back to a stub.
 */
let apiClient;
try {
  apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
  });
} catch (error) {
  console.warn("Axios instance could not be created:", error);
  apiClient = {}; // fallback for test/mocked environments
}

/**
 * Attach Authorization header if token exists (skip during Jest tests)
 */
const isTestEnv = typeof jest !== "undefined";
if (!isTestEnv && apiClient?.interceptors?.request) {
  apiClient.interceptors.request.use(
    (config) => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.warn("Could not attach token:", e);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
}

/**
 * Global response interceptor
 * Handles unauthorized (401) responses.
 */
if (apiClient?.interceptors?.response) {
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        console.warn("Unauthorized — token may be missing or expired.");
        // Optionally handle logout logic here:
        // localStorage.removeItem("token");
        // window.location.href = "/";
      }
      return Promise.reject(error);
    }
  );
}

/**
 * Unified API request wrapper with safe fallbacks.
 */
export const api = {
  /**
   * GET request
   * @param {string} endpoint - API endpoint (relative path)
   * @param {Object} [params] - Query parameters
   * @returns {Promise<any>} Response data
   */
  get: async (endpoint, params = {}) => {
    if (!apiClient?.get) throw new Error("API client not initialized");
    const response = await apiClient.get(endpoint, { params });
    return response?.data || response;
  },

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} [body] - Request body
   * @returns {Promise<any>} Response data
   */
  post: async (endpoint, body = {}) => {
    if (!apiClient?.post) throw new Error("API client not initialized");
    const response = await apiClient.post(endpoint, body);
    return response?.data || response;
  },

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} [body] - Request body
   * @returns {Promise<any>} Response data
   */
  put: async (endpoint, body = {}) => {
    if (!apiClient?.put) throw new Error("API client not initialized");
    const response = await apiClient.put(endpoint, body);
    return response?.data || response;
  },

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} [params] - Query parameters
   * @returns {Promise<any>} Response data
   */
  delete: async (endpoint, params = {}) => {
    if (!apiClient?.delete) throw new Error("API client not initialized");
    const response = await apiClient.delete(endpoint, { params });
    return response?.data || response;
  },
};

export default api;
