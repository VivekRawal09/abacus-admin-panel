import { apiService } from './api';

export const usersService = {
  // Get all users with pagination and filters - FIXED: Handle backend response format
  getUsers: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add filters
      if (params.role) queryParams.append('role', params.role);
      if (params.institute_id) queryParams.append('institute_id', params.institute_id);
      if (params.zone_id) queryParams.append('zone_id', params.zone_id);
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.order) queryParams.append('order', params.order);
      
      const url = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      
      // FIXED: Handle backend response format
      // Backend returns: { success: true, data: [...], pagination: {...} }
      // Frontend expects: { data: [...], pagination: {...} }
      if (response.success && response.data) {
        return {
          data: response.data,
          pagination: response.pagination || {
            currentPage: parseInt(params.page) || 1,
            totalPages: 1,
            totalItems: response.data.length,
            pageSize: parseInt(params.limit) || 20
          }
        };
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single user by ID - FIXED: Handle backend response format
  getUserById: async (id) => {
    try {
      const response = await apiService.get(`/users/${id}`);
      
      // FIXED: Handle backend response format
      if (response.success && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create new user - FIXED: Handle backend response format and field names
  createUser: async (userData) => {
    try {
      // FIXED: Ensure we send the correct field names (snake_case)
      const requestData = {
        first_name: userData.first_name || userData.firstName,
        last_name: userData.last_name || userData.lastName,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        phone: userData.phone,
        date_of_birth: userData.date_of_birth || userData.dateOfBirth,
        address: userData.address,
        institute_id: userData.institute_id || userData.instituteId,
        zone_id: userData.zone_id || userData.zoneId,
        parent_id: userData.parent_id || userData.parentId,
        grade: userData.grade,
        section: userData.section,
        is_active: userData.is_active !== undefined ? userData.is_active : 
                   userData.isActive !== undefined ? userData.isActive : true
      };

      const response = await apiService.post('/users', requestData);
      
      // FIXED: Handle backend response format
      if (response.success && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update user - FIXED: Handle backend response format
  updateUser: async (id, userData) => {
    try {
      // FIXED: Ensure we send the correct field names (snake_case)
      const requestData = {};
      
      // Map frontend fields to backend fields
      if (userData.first_name !== undefined || userData.firstName !== undefined) {
        requestData.first_name = userData.first_name || userData.firstName;
      }
      if (userData.last_name !== undefined || userData.lastName !== undefined) {
        requestData.last_name = userData.last_name || userData.lastName;
      }
      if (userData.email !== undefined) requestData.email = userData.email;
      if (userData.phone !== undefined) requestData.phone = userData.phone;
      if (userData.role !== undefined) requestData.role = userData.role;
      if (userData.date_of_birth !== undefined || userData.dateOfBirth !== undefined) {
        requestData.date_of_birth = userData.date_of_birth || userData.dateOfBirth;
      }
      if (userData.address !== undefined) requestData.address = userData.address;
      if (userData.institute_id !== undefined || userData.instituteId !== undefined) {
        requestData.institute_id = userData.institute_id || userData.instituteId;
      }
      if (userData.zone_id !== undefined || userData.zoneId !== undefined) {
        requestData.zone_id = userData.zone_id || userData.zoneId;
      }
      if (userData.is_active !== undefined || userData.isActive !== undefined) {
        requestData.is_active = userData.is_active !== undefined ? userData.is_active : userData.isActive;
      }

      const response = await apiService.put(`/users/${id}`, requestData);
      
      // FIXED: Handle backend response format
      if (response.success && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete user - FIXED: Handle backend response format
  deleteUser: async (id) => {
    try {
      const response = await apiService.delete(`/users/${id}`);
      
      // FIXED: Handle backend response format
      if (response.success) {
        return { success: true, message: response.message || 'User deleted successfully' };
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get users by role
  getUsersByRole: async (role, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('role', role);
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.institute_id) queryParams.append('institute_id', params.institute_id);
      if (params.zone_id) queryParams.append('zone_id', params.zone_id);
      if (params.search) queryParams.append('search', params.search);
      
      const response = await apiService.get(`/users?${queryParams.toString()}`);
      
      // FIXED: Handle backend response format
      if (response.success && response.data) {
        return {
          data: response.data,
          pagination: response.pagination
        };
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user statistics - FIXED: Handle backend response format
  getUserStats: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.institute_id) queryParams.append('institute_id', params.institute_id);
      if (params.zone_id) queryParams.append('zone_id', params.zone_id);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      
      const url = `/users/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      
      // FIXED: Handle backend response format
      if (response.success && response.stats) {
        return response.stats;
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user progress
  getUserProgress: async (id, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.subject) queryParams.append('subject', params.subject);
      
      const url = `/users/${id}/progress${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update user status (activate/deactivate) - FIXED: Use correct endpoint
  updateUserStatus: async (id, isActive) => {
    try {
      // FIXED: Use the same endpoint as update, not a separate status endpoint
      const response = await apiService.put(`/users/${id}`, {
        is_active: isActive
      });
      
      // FIXED: Handle backend response format
      if (response.success && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Bulk update users - FIXED: Use correct endpoint structure
  bulkUpdateUsers: async (userIds, updateData) => {
    try {
      // FIXED: Convert to snake_case for backend
      const backendUpdateData = {};
      if (updateData.first_name || updateData.firstName) {
        backendUpdateData.first_name = updateData.first_name || updateData.firstName;
      }
      if (updateData.last_name || updateData.lastName) {
        backendUpdateData.last_name = updateData.last_name || updateData.lastName;
      }
      if (updateData.is_active !== undefined || updateData.isActive !== undefined) {
        backendUpdateData.is_active = updateData.is_active !== undefined ? updateData.is_active : updateData.isActive;
      }
      if (updateData.role) backendUpdateData.role = updateData.role;

      const response = await apiService.post('/users/bulk-update', {
        user_ids: userIds,
        update_data: backendUpdateData
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Bulk delete users - FIXED: Use correct field name
  bulkDeleteUsers: async (userIds) => {
    try {
      const response = await apiService.post('/users/bulk-delete', {
        user_ids: userIds  // FIXED: Use user_ids (snake_case)
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Reset user password
  resetUserPassword: async (id, newPassword) => {
    try {
      const response = await apiService.post(`/users/${id}/reset-password`, {
        new_password: newPassword
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user activity log
  getUserActivity: async (id, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.activity_type) queryParams.append('activity_type', params.activity_type);
      
      const url = `/users/${id}/activity${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Import users from CSV
  importUsers: async (csvFile, options = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', csvFile);
      
      if (options.skipHeader !== undefined) {
        formData.append('skip_header', options.skipHeader);
      }
      if (options.defaultRole) {
        formData.append('default_role', options.defaultRole);
      }
      if (options.defaultInstituteId) {
        formData.append('default_institute_id', options.defaultInstituteId);
      }
      
      const response = await apiService.upload('/users/import', formData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Export users to CSV - FIXED: Handle blob response
  exportUsers: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.role) queryParams.append('role', params.role);
      if (params.institute_id) queryParams.append('institute_id', params.institute_id);
      if (params.zone_id) queryParams.append('zone_id', params.zone_id);
      if (params.format) queryParams.append('format', params.format);
      
      const url = `/users/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      // FIXED: Handle different response types based on format
      if (params.format === 'csv' || params.format === 'xlsx') {
        const response = await apiService.download(url);
        return response;
      } else {
        // JSON format
        const response = await apiService.get(url);
        return response;
      }
    } catch (error) {
      throw error;
    }
  }
};