import { apiService } from './api';

export const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await apiService.post('/auth/login', {
        email,
        password
      });
      
      // Handle backend response format: { success, data: { user, token } }
      if (response && response.success && response.data) {
        const { user, token } = response.data;
        
        // CRITICAL FIX: Login returns camelCase, Profile returns snake_case
        // Normalize to snake_case for consistent frontend usage
        const normalizedUser = {
          id: user.id,
          // LOGIN ENDPOINT RETURNS: firstName, lastName, instituteName (camelCase)
          first_name: user.firstName || user.first_name,    
          last_name: user.lastName || user.last_name,       
          email: user.email,
          role: user.role,
          institute_name: user.instituteName || user.institute_name,
          zone_name: user.zoneName || user.zone_name,
          phone: user.phone,
          is_active: user.is_active !== undefined ? user.is_active : user.isActive !== undefined ? user.isActive : true,
          created_at: user.created_at || user.createdAt || new Date().toISOString(),
        };
        
        return {
          success: true,
          user: normalizedUser,
          token: token,
          message: response.message || 'Login successful'
        };
      }
      
      // Handle error responses
      return {
        success: false,
        error: response.message || response.error || 'Invalid login response'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 
               error.response?.data?.message || 
               error.message || 
               'Login failed'
      };
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await apiService.get('/auth/profile');
      
      // Handle different response formats
      if (response && response.success && response.user) {
        // ENHANCED: Handle success response format
        const user = response.user;
        return { 
          user: {
            id: user.id,
            // PROFILE ENDPOINT RETURNS: first_name, last_name, institute_name (snake_case)
            first_name: user.first_name || user.firstName,  
            last_name: user.last_name || user.lastName,     
            email: user.email,
            role: user.role,
            institute_name: user.institute_name || user.instituteName,
            zone_name: user.zone_name || user.zoneName,
            phone: user.phone,
            is_active: user.is_active !== undefined ? user.is_active : user.isActive !== undefined ? user.isActive : true,
            created_at: user.created_at || user.createdAt || new Date().toISOString(),
          }
        };
      } else if (response && response.user) {
        // If response has nested user object
        const user = response.user;
        return { 
          user: {
            id: user.id,
            first_name: user.first_name || user.firstName,  
            last_name: user.last_name || user.lastName,     
            email: user.email,
            role: user.role,
            institute_name: user.institute_name || user.instituteName,
            zone_name: user.zone_name || user.zoneName,
            phone: user.phone,
            is_active: user.is_active !== undefined ? user.is_active : user.isActive !== undefined ? user.isActive : true,
            created_at: user.created_at || user.createdAt || new Date().toISOString(),
          }
        };
      } else if (response && response.id) {
        // Direct user object - normalize field names
        return { 
          user: {
            id: response.id,
            first_name: response.first_name || response.firstName,  
            last_name: response.last_name || response.lastName,     
            email: response.email,
            role: response.role,
            institute_name: response.institute_name || response.instituteName,
            zone_name: response.zone_name || response.zoneName,
            phone: response.phone,
            is_active: response.is_active !== undefined ? response.is_active : response.isActive !== undefined ? response.isActive : true,
            created_at: response.created_at || response.createdAt || new Date().toISOString(),
          }
        };
      }
      
      return response;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Refresh token (if implemented on backend)
  refreshToken: async () => {
    try {
      const response = await apiService.post('/auth/refresh');
      return response;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await apiService.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      return response;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  // Update profile
  updateProfile: async (profileData) => {
    try {
      // Convert frontend data to backend format (snake_case)
      const backendData = {
        first_name: profileData.first_name || profileData.firstName,
        last_name: profileData.last_name || profileData.lastName,
        phone: profileData.phone,
        address: profileData.address,
        date_of_birth: profileData.date_of_birth || profileData.dateOfBirth,
        // Don't include email, role as they might not be editable
      };

      // Remove undefined values
      Object.keys(backendData).forEach(key => {
        if (backendData[key] === undefined) {
          delete backendData[key];
        }
      });

      const response = await apiService.put('/auth/profile', backendData);
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await apiService.post('/auth/forgot-password', {
        email
      });
      return response;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await apiService.post('/auth/reset-password', {
        token,
        new_password: newPassword
      });
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  // Verify email (if implemented)
  verifyEmail: async (token) => {
    try {
      const response = await apiService.post('/auth/verify-email', {
        token
      });
      return response;
    } catch (error) {
      console.error('Verify email error:', error);
      throw error;
    }
  },

  // Resend verification email (if implemented)
  resendVerification: async (email) => {
    try {
      const response = await apiService.post('/auth/resend-verification', {
        email
      });
      return response;
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  },

  // Logout (clear token from localStorage)
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('auth_token');
    return !!token && !authService.isTokenExpired();
  },

  // Check if token is expired (basic check)
  isTokenExpired: () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return true;

    try {
      // Basic JWT token expiration check
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      // If we can't parse the token, consider it expired
      return true;
    }
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('auth_token');
  },

  // Store token
  setToken: (token) => {
    if (token) {
      localStorage.setItem('auth_token', token);
    }
  },

  // Get stored user data
  getStoredUser: () => {
    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  },

  // Store user data
  setStoredUser: (userData) => {
    if (userData) {
      localStorage.setItem('user_data', JSON.stringify(userData));
    }
  },

  // Clear all auth data
  clearAuthData: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  },

  // Validate login credentials format
  validateCredentials: (email, password) => {
    const errors = [];

    if (!email || !email.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Please enter a valid email address');
    }

    if (!password || !password.trim()) {
      errors.push('Password is required');
    } else if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Test API connection
  testConnection: async () => {
    try {
      const response = await apiService.get('/health');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Connection failed'
      };
    }
  }
};