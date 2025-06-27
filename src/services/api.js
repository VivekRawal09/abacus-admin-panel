import axios from 'axios';
import toast from 'react-hot-toast';

console.log('API_BASE_URL:', process.env.REACT_APP_API_URL);

// Base API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://abacus-backend.vercel.app/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors for real API
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          window.location.href = '/login';
          toast.error('Session expired. Please login again.');
          break;
          
        case 403:
          // Forbidden - insufficient permissions
          toast.error('You do not have permission to perform this action.');
          break;
          
        case 404:
          // Not found
          toast.error('Resource not found.');
          break;
          
        case 422:
          // Validation error
          const message = data?.error || data?.message || 'Validation error';
          toast.error(message);
          break;
          
        case 429:
          // Too many requests
          toast.error('Too many requests. Please try again later.');
          break;
          
        case 500:
          // Server error
          toast.error('Server error. Please try again later.');
          break;
          
        default:
          // Other errors
          const errorMessage = data?.error || data?.message || 'An error occurred';
          toast.error(errorMessage);
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.');
    } else {
      // Other errors
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

// API service methods - REAL API ONLY
export const apiService = {
  // GET request
  get: async (url, config = {}) => {
    try {
      const response = await apiClient.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST request
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT request
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PATCH request
  patch: async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE request
  delete: async (url, config = {}) => {
    try {
      const response = await apiClient.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Health check - FIXED: Use correct path without /api prefix
  healthCheck: async () => {
    try {
      // Health endpoint is at root level, not under /api
      const response = await axios.get('https://abacus-backend.vercel.app/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'error', message: 'API not accessible' };
    }
  },

  // Upload file
  upload: async (url, formData, config = {}) => {
    try {
      const response = await apiClient.post(url, formData, {
        ...config,
        headers: {
          ...config.headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Download file
  download: async (url, config = {}) => {
    try {
      const response = await apiClient.get(url, {
        ...config,
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Helper function to build query string
export const buildQueryString = (params) => {
  const query = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== null && value !== undefined && value !== '') {
      query.append(key, value);
    }
  });
  
  return query.toString();
};

// Helper function to handle pagination params
export const buildPaginationParams = ({ page = 1, limit = 20, search = '', ...filters }) => {
  const params = {
    page: page.toString(),
    limit: limit.toString(),
  };

  if (search) {
    params.search = search;
  }

  // Add filter parameters
  Object.keys(filters).forEach(key => {
    if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
      params[key] = filters[key];
    }
  });

  return params;
};

// Test API connectivity
export const testApiConnection = async () => {
  try {
    console.log('Testing API connection to:', API_BASE_URL);
    const response = await apiService.healthCheck();
    console.log('API Health Check Response:', response);
    return response;
  } catch (error) {
    console.error('API Connection Test Failed:', error);
    throw error;
  }
};

export default apiService;