import { apiService } from './api';

export const institutesService = {
  // Get all institutes with pagination and filters - FIXED: Handle backend response format
  getInstitutes: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add filters
      if (params.zone_id) queryParams.append('zone_id', params.zone_id);
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.order) queryParams.append('order', params.order);
      
      const url = `/institutes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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

  // Get single institute by ID - FIXED: Handle backend response format
  getInstituteById: async (id) => {
    try {
      const response = await apiService.get(`/institutes/${id}`);
      
      // FIXED: Handle backend response format
      if (response.success && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create new institute - FIXED: Handle backend response format and field names
  createInstitute: async (instituteData) => {
    try {
      // FIXED: Ensure we send the correct field names (snake_case)
      const requestData = {
        name: instituteData.name,
        code: instituteData.code,
        address: instituteData.address,
        city: instituteData.city,
        state: instituteData.state,
        country: instituteData.country,
        postal_code: instituteData.postal_code || instituteData.pincode, // Handle both field names
        pincode: instituteData.pincode || instituteData.postal_code,     // Backend might expect pincode
        phone: instituteData.phone,
        email: instituteData.email,
        website: instituteData.website,
        zone_id: instituteData.zone_id,
        admin_id: instituteData.admin_id,
        established_date: instituteData.established_date,
        is_active: instituteData.is_active !== undefined ? instituteData.is_active : true,
        description: instituteData.description
      };

      const response = await apiService.post('/institutes', requestData);
      
      // FIXED: Handle backend response format
      if (response.success && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update institute - FIXED: Handle backend response format
  updateInstitute: async (id, instituteData) => {
    try {
      const response = await apiService.put(`/institutes/${id}`, instituteData);
      
      // FIXED: Handle backend response format
      if (response.success && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete institute - FIXED: Handle backend response format
  deleteInstitute: async (id) => {
    try {
      const response = await apiService.delete(`/institutes/${id}`);
      
      // FIXED: Handle backend response format
      if (response.success) {
        return { success: true, message: response.message || 'Institute deleted successfully' };
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get institutes by zone - FIXED: Handle backend response format
  getInstitutesByZone: async (zoneId, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('zone_id', zoneId);
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      
      const response = await apiService.get(`/institutes?${queryParams.toString()}`);
      
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

  // Get institute statistics - FIXED: Handle backend response format
  getInstituteStats: async (id, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      
      const url = `/institutes/${id}/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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

  // Get institute users (students, teachers, etc.) - FIXED: Handle backend response format
  getInstituteUsers: async (id, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.role) queryParams.append('role', params.role);
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      
      const url = `/institutes/${id}/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      
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

  // Get all zones - FIXED: Handle backend response format
  getZones: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      
      const url = `/zones${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      
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

  // Get single zone by ID - FIXED: Handle backend response format
  getZoneById: async (id) => {
    try {
      const response = await apiService.get(`/zones/${id}`);
      
      // FIXED: Handle backend response format
      if (response.success && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create new zone - FIXED: Handle backend response format
  createZone: async (zoneData) => {
    try {
      const requestData = {
        name: zoneData.name,
        code: zoneData.code,
        description: zoneData.description,
        region: zoneData.region,
        manager_id: zoneData.manager_id,
        is_active: zoneData.is_active !== undefined ? zoneData.is_active : true
      };

      const response = await apiService.post('/zones', requestData);
      
      // FIXED: Handle backend response format
      if (response.success && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update zone - FIXED: Handle backend response format
  updateZone: async (id, zoneData) => {
    try {
      const response = await apiService.put(`/zones/${id}`, zoneData);
      
      // FIXED: Handle backend response format
      if (response.success && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete zone - FIXED: Handle backend response format
  deleteZone: async (id) => {
    try {
      const response = await apiService.delete(`/zones/${id}`);
      
      // FIXED: Handle backend response format
      if (response.success) {
        return { success: true, message: response.message || 'Zone deleted successfully' };
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get zone statistics - FIXED: Handle backend response format
  getZoneStats: async (id, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      
      const url = `/zones/${id}/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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

  // Update institute status - FIXED: Use correct endpoint
  updateInstituteStatus: async (id, isActive) => {
    try {
      // FIXED: Use the same endpoint as update, not a separate status endpoint
      const response = await apiService.put(`/institutes/${id}`, {
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

  // Update zone status - FIXED: Use correct endpoint
  updateZoneStatus: async (id, isActive) => {
    try {
      // FIXED: Use the same endpoint as update, not a separate status endpoint
      const response = await apiService.put(`/zones/${id}`, {
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

  // Assign admin to institute
  assignInstituteAdmin: async (instituteId, adminId) => {
    try {
      const response = await apiService.post(`/institutes/${instituteId}/assign-admin`, {
        admin_id: adminId
      });
      
      // FIXED: Handle backend response format
      if (response.success) {
        return response;
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Assign manager to zone
  assignZoneManager: async (zoneId, managerId) => {
    try {
      const response = await apiService.post(`/zones/${zoneId}/assign-manager`, {
        manager_id: managerId
      });
      
      // FIXED: Handle backend response format
      if (response.success) {
        return response;
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get institute performance metrics
  getInstitutePerformance: async (id, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.metric) queryParams.append('metric', params.metric);
      
      const url = `/institutes/${id}/performance${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      
      // FIXED: Handle backend response format
      if (response.success && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get zone performance metrics
  getZonePerformance: async (id, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.metric) queryParams.append('metric', params.metric);
      
      const url = `/zones/${id}/performance${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      
      // FIXED: Handle backend response format
      if (response.success && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }
};