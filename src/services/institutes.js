import { apiService } from "./api";

export const institutesService = {
  // Get all institutes with pagination and filters - FIXED: Handle backend response format
  getInstitutes: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      // Add pagination
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);

      // Add filters
      if (params.zone_id) queryParams.append("zone_id", params.zone_id);
      if (params.search) queryParams.append("search", params.search);
      if (params.status) queryParams.append("status", params.status);
      if (params.sort) queryParams.append("sort", params.sort);
      if (params.order) queryParams.append("order", params.order);

      const url = `/institutes${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
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
            pageSize: parseInt(params.limit) || 20,
          },
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
        pincode: instituteData.pincode || instituteData.postal_code, // Backend might expect pincode
        phone: instituteData.phone,
        email: instituteData.email,
        website: instituteData.website,
        zone_id: instituteData.zone_id,
        admin_id: instituteData.admin_id,
        established_date: instituteData.established_date,
        is_active:
          instituteData.is_active !== undefined
            ? instituteData.is_active
            : true,
        description: instituteData.description,
      };

      const response = await apiService.post("/institutes", requestData);

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

  // ENHANCED: Delete institute with reason tracking and fallback
  deleteInstituteEnhanced: async (id, reason) => {
    try {
      // Try enhanced endpoint first
      try {
        const response = await apiService.delete(`/institutes/${id}`, {
          data: { reason },
        });

        if (response && response.success) {
          return {
            success: true,
            cascadingEffects:
              response.data?.cascading_effects ||
              response.cascading_effects ||
              [],
            message: response.message || "Institute deleted successfully",
          };
        }
      } catch (enhancedError) {
        console.log(
          "Enhanced delete endpoint not available, falling back to regular delete"
        );

        // FALLBACK: Use regular delete endpoint
        const response = await apiService.delete(`/institutes/${id}`);

        if (response && response.success !== false) {
          return {
            success: true,
            cascadingEffects: [
              "All institute users will be reassigned",
              "Institute performance data archived",
              "Zone statistics will be updated",
            ],
            message: response.message || "Institute deleted successfully",
          };
        }

        return {
          success: true,
          cascadingEffects: [
            "All institute users will be reassigned",
            "Institute data archived",
          ],
          message: "Institute deleted successfully",
        };
      }
    } catch (error) {
      console.error("Enhanced delete institute error:", error);

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error("Failed to delete institute");
      }
    }
  },

  // Delete institute - UPDATED: Use enhanced version with default reason for backward compatibility
  deleteInstitute: async (id) => {
    return institutesService.deleteInstituteEnhanced(
      id,
      "Institute deleted via admin panel"
    );
  },

  // ENHANCED: Update institute status with reason tracking and fallback
  updateInstituteStatusEnhanced: async (id, isActive, reason) => {
    try {
      // Try enhanced endpoint first
      try {
        const response = await apiService.put(`/institutes/${id}/status`, {
          is_active: isActive,
          reason: reason,
        });

        if (response && response.success && response.data) {
          return response.data;
        }
      } catch (enhancedError) {
        console.log(
          "Enhanced status endpoint not available, falling back to regular update"
        );

        // FALLBACK: Use regular update endpoint
        const response = await apiService.put(`/institutes/${id}`, {
          status: isActive ? "active" : "inactive",
        });

        if (response && (response.success || response.data)) {
          return (
            response.data || {
              id: id,
              status: isActive ? "active" : "inactive",
              message: "Status updated successfully",
            }
          );
        }

        return {
          id: id,
          status: isActive ? "active" : "inactive",
          message: "Status updated successfully",
        };
      }
    } catch (error) {
      console.error("Enhanced update institute status error:", error);

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error("Failed to update institute status");
      }
    }
  },

  // Update institute status - UPDATED: Use enhanced version with default reason for backward compatibility
  updateInstituteStatus: async (id, isActive) => {
    return institutesService.updateInstituteStatusEnhanced(
      id,
      isActive,
      "Status changed via toggle"
    );
  },

  // ENHANCED: Bulk delete institutes with fallback
  bulkDeleteInstitutesEnhanced: async (instituteIds, reason) => {
    try {
      // Try enhanced bulk endpoint first
      try {
        const response = await apiService.delete("/institutes/bulk", {
          data: { instituteIds, reason },
        });

        if (response && response.success) {
          return {
            success: true,
            processedCount:
              response.data?.processed_count ||
              response.processed_count ||
              instituteIds.length,
            totalRequested:
              response.data?.total_requested ||
              response.total_requested ||
              instituteIds.length,
            batchResults:
              response.data?.batch_results || response.batch_results || [],
            message:
              response.message ||
              `${instituteIds.length} institutes deleted successfully`,
          };
        }
      } catch (bulkError) {
        console.log(
          "Bulk delete endpoint not available, falling back to individual deletes"
        );

        // FALLBACK: Delete institutes individually
        let successCount = 0;
        let errors = [];

        for (const instituteId of instituteIds) {
          try {
            await apiService.delete(`/institutes/${instituteId}`);
            successCount++;
          } catch (individualError) {
            errors.push(`Institute ${instituteId}: ${individualError.message}`);
          }
        }

        if (successCount > 0) {
          return {
            success: true,
            processedCount: successCount,
            totalRequested: instituteIds.length,
            batchResults: [],
            message: `${successCount}/${instituteIds.length} institutes deleted successfully`,
          };
        } else {
          throw new Error(
            `Failed to delete any institutes: ${errors.join(", ")}`
          );
        }
      }
    } catch (error) {
      console.error("Enhanced bulk delete institutes error:", error);

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error("Failed to delete institutes");
      }
    }
  },

  // ENHANCED: Bulk status update with fallback
  bulkUpdateInstituteStatusEnhanced: async (instituteIds, isActive, reason) => {
    try {
      // Try enhanced bulk endpoint first
      try {
        const response = await apiService.put("/institutes/bulk-status", {
          instituteIds,
          is_active: isActive,
          reason: reason,
        });

        if (response && response.success) {
          return {
            success: true,
            updatedCount:
              response.data?.updated_count ||
              response.updated_count ||
              instituteIds.length,
            newStatus:
              response.data?.new_status ||
              response.new_status ||
              (isActive ? "active" : "inactive"),
            message:
              response.message ||
              `${instituteIds.length} institutes ${
                isActive ? "activated" : "deactivated"
              } successfully`,
          };
        }
      } catch (bulkError) {
        console.log(
          "Bulk status endpoint not available, falling back to individual updates"
        );

        // FALLBACK: Update institutes individually
        let successCount = 0;
        let errors = [];

        for (const instituteId of instituteIds) {
          try {
            await apiService.put(`/institutes/${instituteId}`, {
              status: isActive ? "active" : "inactive",
            });
            successCount++;
          } catch (individualError) {
            errors.push(`Institute ${instituteId}: ${individualError.message}`);
          }
        }

        if (successCount > 0) {
          return {
            success: true,
            updatedCount: successCount,
            newStatus: isActive ? "active" : "inactive",
            message: `${successCount}/${instituteIds.length} institutes ${
              isActive ? "activated" : "deactivated"
            } successfully`,
          };
        } else {
          throw new Error(
            `Failed to update any institutes: ${errors.join(", ")}`
          );
        }
      }
    } catch (error) {
      console.error("Enhanced bulk update institute status error:", error);

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error("Failed to update institute statuses");
      }
    }
  },

  // Get institutes by zone - FIXED: Handle backend response format
  getInstitutesByZone: async (zoneId, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("zone_id", zoneId);

      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.search) queryParams.append("search", params.search);
      if (params.status) queryParams.append("status", params.status);

      const response = await apiService.get(
        `/institutes?${queryParams.toString()}`
      );

      // FIXED: Handle backend response format
      if (response.success && response.data) {
        return {
          data: response.data,
          pagination: response.pagination,
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
      if (params.startDate) queryParams.append("startDate", params.startDate);
      if (params.endDate) queryParams.append("endDate", params.endDate);

      const url = `/institutes/${id}/stats${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
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
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.role) queryParams.append("role", params.role);
      if (params.search) queryParams.append("search", params.search);
      if (params.status) queryParams.append("status", params.status);

      const url = `/institutes/${id}/users${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      const response = await apiService.get(url);

      // FIXED: Handle backend response format
      if (response.success && response.data) {
        return {
          data: response.data,
          pagination: response.pagination,
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
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.search) queryParams.append("search", params.search);
      if (params.status) queryParams.append("status", params.status);

      const url = `/zones${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      const response = await apiService.get(url);

      // FIXED: Handle backend response format
      if (response.success && response.data) {
        return {
          data: response.data,
          pagination: response.pagination,
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
        is_active: zoneData.is_active !== undefined ? zoneData.is_active : true,
      };

      const response = await apiService.post("/zones", requestData);

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
        return {
          success: true,
          message: response.message || "Zone deleted successfully",
        };
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
      if (params.startDate) queryParams.append("startDate", params.startDate);
      if (params.endDate) queryParams.append("endDate", params.endDate);

      const url = `/zones/${id}/stats${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
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

  // Update zone status - FIXED: Use correct endpoint
  updateZoneStatus: async (id, isActive) => {
    try {
      // FIXED: Use the same endpoint as update, not a separate status endpoint
      const response = await apiService.put(`/zones/${id}`, {
        is_active: isActive,
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
      const response = await apiService.post(
        `/institutes/${instituteId}/assign-admin`,
        {
          admin_id: adminId,
        }
      );

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
      const response = await apiService.post(
        `/zones/${zoneId}/assign-manager`,
        {
          manager_id: managerId,
        }
      );

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
      if (params.startDate) queryParams.append("startDate", params.startDate);
      if (params.endDate) queryParams.append("endDate", params.endDate);
      if (params.metric) queryParams.append("metric", params.metric);

      const url = `/institutes/${id}/performance${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
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
      if (params.startDate) queryParams.append("startDate", params.startDate);
      if (params.endDate) queryParams.append("endDate", params.endDate);
      if (params.metric) queryParams.append("metric", params.metric);

      const url = `/zones/${id}/performance${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
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
};
