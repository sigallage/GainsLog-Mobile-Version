import { CapacitorHttp } from '@capacitor/core';
import { Capacitor } from '@capacitor/core';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Check if we're on a mobile platform
const isMobile = Capacitor.isNativePlatform();

export const httpClient = {
  async get(url, options = {}) {
    if (isMobile) {
      try {
        const response = await CapacitorHttp.get({
          url,
          headers: options.headers || {},
        });
        return {
          data: response.data,
          status: response.status,
          headers: response.headers,
        };
      } catch (error) {
        throw error;
      }
    } else {
      return await axios.get(url, options);
    }
  },

  async post(url, data = {}, options = {}) {
    if (isMobile) {
      try {
        const response = await CapacitorHttp.post({
          url,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          data: data,
        });
        return {
          data: response.data,
          status: response.status,
          headers: response.headers,
        };
      } catch (error) {
        throw error;
      }
    } else {
      return await axios.post(url, data, options);
    }
  },

  async put(url, data = {}, options = {}) {
    if (isMobile) {
      try {
        const response = await CapacitorHttp.put({
          url,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          data: data,
        });
        return {
          data: response.data,
          status: response.status,
          headers: response.headers,
        };
      } catch (error) {
        throw error;
      }
    } else {
      return await axios.put(url, data, options);
    }
  },

  async delete(url, options = {}) {
    if (isMobile) {
      try {
        const response = await CapacitorHttp.delete({
          url,
          headers: options.headers || {},
        });
        return {
          data: response.data,
          status: response.status,
          headers: response.headers,
        };
      } catch (error) {
        throw error;
      }
    } else {
      return await axios.delete(url, options);
    }
  }
};

// Helper function for API calls to our backend
export const apiClient = {
  get: (endpoint, options = {}) => httpClient.get(`${API_URL}${endpoint}`, options),
  post: (endpoint, data, options = {}) => httpClient.post(`${API_URL}${endpoint}`, data, options),
  put: (endpoint, data, options = {}) => httpClient.put(`${API_URL}${endpoint}`, data, options),
  delete: (endpoint, options = {}) => httpClient.delete(`${API_URL}${endpoint}`, options),
};
