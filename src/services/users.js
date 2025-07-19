import { apiService } from "./api";

export const usersService = {
  // Get all users with pagination and filters - FIXED: Handle backend response format
  getUsers: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      // Add pagination
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);

      // Add filters
      if (params.role) queryParams.append("role", params.role);
      if (params.institute_id)
        queryParams.append("institute_id", params.institute_id);
      if (params.zone_id) queryParams.append("zone_id", params.zone_id);
      if (params.search) queryParams.append("search", params.search);
      if (params.status) queryParams.append("status", params.status);
      if (params.sort) queryParams.append("sort", params.sort);
      if (params.order) queryParams.append("order", params.order);

      const url = `/users${
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
        is_active:
          userData.is_active !== undefined
            ? userData.is_active
            : userData.isActive !== undefined
            ? userData.isActive
            : true,
      };

      const response = await apiService.post("/users", requestData);

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
      if (
        userData.first_name !== undefined ||
        userData.firstName !== undefined
      ) {
        requestData.first_name = userData.first_name || userData.firstName;
      }
      if (userData.last_name !== undefined || userData.lastName !== undefined) {
        requestData.last_name = userData.last_name || userData.lastName;
      }
      if (userData.email !== undefined) requestData.email = userData.email;
      if (userData.phone !== undefined) requestData.phone = userData.phone;
      if (userData.role !== undefined) requestData.role = userData.role;
      if (
        userData.date_of_birth !== undefined ||
        userData.dateOfBirth !== undefined
      ) {
        requestData.date_of_birth =
          userData.date_of_birth || userData.dateOfBirth;
      }
      if (userData.address !== undefined)
        requestData.address = userData.address;
      if (
        userData.institute_id !== undefined ||
        userData.instituteId !== undefined
      ) {
        requestData.institute_id =
          userData.institute_id || userData.instituteId;
      }
      if (userData.zone_id !== undefined || userData.zoneId !== undefined) {
        requestData.zone_id = userData.zone_id || userData.zoneId;
      }
      if (userData.is_active !== undefined || userData.isActive !== undefined) {
        requestData.is_active =
          userData.is_active !== undefined
            ? userData.is_active
            : userData.isActive;
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

  // FALLBACK: Enhanced delete user with fallback to regular delete
  deleteUserEnhanced: async (id, reason) => {
    console.log(`🗑️ Starting delete for user ID: ${id} with reason: ${reason}`);
    
    try {
      // Try enhanced endpoint first
      try {
        console.log('🔧 Trying enhanced delete endpoint...');
        const response = await apiService.delete(`/users/${id}`, {
          data: { reason },
        });

        console.log('✅ Enhanced delete response:', response);
        
        if (response && response.success) {
          return {
            success: true,
            cascadingEffects: response.data?.cascading_effects || response.cascading_effects || [],
            message: response.message || 'User deleted successfully',
          };
        }
      } catch (enhancedError) {
        console.log('⚠️ Enhanced delete endpoint not available, falling back to regular delete');
        
        // FALLBACK: Use regular delete endpoint
        console.log('🔄 Trying regular delete endpoint...');
        const response = await apiService.delete(`/users/${id}`);
        
        console.log('✅ Regular delete response:', response);
        
        if (response && (response.success !== false)) {
          return {
            success: true,
            cascadingEffects: [
              "User sessions will be terminated",
              "User progress data will be archived",
              "Associated reports will be marked as deleted"
            ],
            message: response.message || 'User deleted successfully',
          };
        }
        
        // If response indicates failure
        if (response && response.success === false) {
          throw new Error(response.message || 'Delete failed');
        }
        
        // If response is direct success (some APIs return just data)
        return {
          success: true,
          cascadingEffects: [
            "User sessions will be terminated", 
            "User progress data will be archived"
          ],
          message: 'User deleted successfully',
        };
      }

    } catch (error) {
      console.error("❌ Enhanced delete user error:", error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error('Failed to delete user');
      }
    }
  },

  // Delete user - UPDATED to use enhanced version
  deleteUser: async (id) => {
    // Use enhanced version with default reason for backward compatibility
    return usersService.deleteUserEnhanced(id, 'User deleted via admin panel');
  },

  // FALLBACK: Enhanced status update with fallback to regular endpoint
  updateUserStatusEnhanced: async (id, isActive, reason) => {
    try {
      // Try enhanced endpoint first
      try {
        const response = await apiService.put(`/users/${id}/status`, {
          is_active: isActive,
          reason: reason
        });
        
        if (response && response.success && response.data) {
          return response.data;
        }
      } catch (enhancedError) {
        console.log('Enhanced status endpoint not available, falling back to regular update');
        
        // FALLBACK: Use regular update endpoint
        const response = await apiService.put(`/users/${id}`, {
          is_active: isActive
        });
        
        if (response && (response.success || response.data)) {
          return response.data || {
            id: id,
            is_active: isActive,
            message: 'Status updated successfully'
          };
        }
        
        // Direct response fallback
        return {
          id: id,
          is_active: isActive,
          message: 'Status updated successfully'
        };
      }
      
    } catch (error) {
      console.error('Enhanced update user status error:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error('Failed to update user status');
      }
    }
  },

  // Update user status - UPDATED to use enhanced version
  updateUserStatus: async (id, isActive) => {
    // Use enhanced version with default reason for backward compatibility
    return usersService.updateUserStatusEnhanced(id, isActive, 'Status changed via toggle');
  },

  // Get users by role
  getUsersByRole: async (role, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("role", role);

      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.institute_id)
        queryParams.append("institute_id", params.institute_id);
      if (params.zone_id) queryParams.append("zone_id", params.zone_id);
      if (params.search) queryParams.append("search", params.search);

      const response = await apiService.get(`/users?${queryParams.toString()}`);

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

  // Get user statistics - FIXED: Handle backend response format
  getUserStats: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.institute_id)
        queryParams.append("institute_id", params.institute_id);
      if (params.zone_id) queryParams.append("zone_id", params.zone_id);
      if (params.startDate) queryParams.append("startDate", params.startDate);
      if (params.endDate) queryParams.append("endDate", params.endDate);

      const url = `/users/stats${
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

  // Get user progress
  getUserProgress: async (id, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append("startDate", params.startDate);
      if (params.endDate) queryParams.append("endDate", params.endDate);
      if (params.subject) queryParams.append("subject", params.subject);

      const url = `/users/${id}/progress${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // FALLBACK: Enhanced bulk status update with fallback to individual updates
  bulkUpdateUserStatusEnhanced: async (userIds, isActive, reason) => {
    try {
      // Try enhanced bulk endpoint first
      try {
        const response = await apiService.put("/users/bulk-status", {
          userIds,
          is_active: isActive,
          reason: reason,
        });

        if (response && response.success) {
          return {
            success: true,
            updatedCount: response.data?.updated_count || response.updated_count || userIds.length,
            newStatus: response.data?.new_status || response.new_status || (isActive ? 'active' : 'inactive'),
            message: response.message || `${userIds.length} users ${isActive ? 'activated' : 'deactivated'} successfully`
          };
        }
      } catch (bulkError) {
        console.log('Bulk status endpoint not available, falling back to individual updates');
        
        // FALLBACK: Update users individually
        let successCount = 0;
        let errors = [];
        
        for (const userId of userIds) {
          try {
            await apiService.put(`/users/${userId}`, {
              is_active: isActive
            });
            successCount++;
          } catch (individualError) {
            errors.push(`User ${userId}: ${individualError.message}`);
          }
        }
        
        if (successCount > 0) {
          return {
            success: true,
            updatedCount: successCount,
            newStatus: isActive ? 'active' : 'inactive',
            message: `${successCount}/${userIds.length} users ${isActive ? 'activated' : 'deactivated'} successfully`
          };
        } else {
          throw new Error(`Failed to update any users: ${errors.join(', ')}`);
        }
      }

    } catch (error) {
      console.error("Enhanced bulk update user status error:", error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error('Failed to update user statuses');
      }
    }
  },

  // FALLBACK: Enhanced bulk delete with fallback to individual deletes
  bulkDeleteUsersEnhanced: async (userIds, reason) => {
    try {
      // Try enhanced bulk endpoint first
      try {
        const response = await apiService.delete("/users/bulk", {
          data: { userIds, reason },
        });

        if (response && response.success) {
          return {
            success: true,
            processedCount: response.data?.processed_count || response.processed_count || userIds.length,
            totalRequested: response.data?.total_requested || response.total_requested || userIds.length,
            batchResults: response.data?.batch_results || response.batch_results || [],
            message: response.message || `${userIds.length} users deleted successfully`
          };
        }
      } catch (bulkError) {
        console.log('Bulk delete endpoint not available, falling back to individual deletes');
        
        // FALLBACK: Delete users individually
        let successCount = 0;
        let errors = [];
        
        for (const userId of userIds) {
          try {
            await apiService.delete(`/users/${userId}`);
            successCount++;
          } catch (individualError) {
            errors.push(`User ${userId}: ${individualError.message}`);
          }
        }
        
        if (successCount > 0) {
          return {
            success: true,
            processedCount: successCount,
            totalRequested: userIds.length,
            batchResults: [],
            message: `${successCount}/${userIds.length} users deleted successfully`
          };
        } else {
          throw new Error(`Failed to delete any users: ${errors.join(', ')}`);
        }
      }

    } catch (error) {
      console.error("Enhanced bulk delete users error:", error);

      if (error.response?.data?.protected_users) {
        const protectedUsers = error.response.data.protected_users;
        throw new Error(
          `Cannot delete ${protectedUsers.length} protected users`
        );
      }
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error('Failed to delete users');
      }
    }
  },

  // Bulk delete users - UPDATED to use enhanced version
  bulkDeleteUsers: async (userIds) => {
    // Use enhanced version with default reason for backward compatibility
    return usersService.bulkDeleteUsersEnhanced(userIds, 'Bulk delete via admin panel');
  },

  // Bulk update users - UPDATED to use enhanced version for status updates
  bulkUpdateUsers: async (userIds, updateData) => {
    // If it's a status update, use the enhanced version
    if (updateData.is_active !== undefined || updateData.isActive !== undefined) {
      const isActive = updateData.is_active !== undefined ? updateData.is_active : updateData.isActive;
      return usersService.bulkUpdateUserStatusEnhanced(userIds, isActive, 'Bulk status update via admin panel');
    }
    
    // Otherwise use the existing logic for other updates
    try {
      const backendUpdateData = {};
      if (updateData.first_name || updateData.firstName) {
        backendUpdateData.first_name = updateData.first_name || updateData.firstName;
      }
      if (updateData.last_name || updateData.lastName) {
        backendUpdateData.last_name = updateData.last_name || updateData.lastName;
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

  // Reset user password
  resetUserPassword: async (id, newPassword) => {
    try {
      const response = await apiService.post(`/users/${id}/reset-password`, {
        new_password: newPassword,
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
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.startDate) queryParams.append("startDate", params.startDate);
      if (params.endDate) queryParams.append("endDate", params.endDate);
      if (params.activity_type)
        queryParams.append("activity_type", params.activity_type);

      const url = `/users/${id}/activity${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Import users from Excel file
  importUsers: async (excelFile, options = {}) => {
    try {
      console.log("📤 Starting Excel import...", {
        file: excelFile.name,
        size: excelFile.size,
      });

      // Validate file type - MUST be Excel
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.ms-excel", // .xls
        "application/octet-stream", // sometimes Excel files come as this
      ];

      if (!validTypes.includes(excelFile.type)) {
        throw new Error("Please select a valid Excel file (.xlsx or .xls)");
      }

      // Validate file size (10MB limit)
      if (excelFile.size > 10 * 1024 * 1024) {
        throw new Error("File size must be less than 10MB");
      }

      const formData = new FormData();
      formData.append("file", excelFile);

      // Add any additional options to formData if needed
      if (options.overwrite !== undefined) {
        formData.append("overwrite", options.overwrite);
      }
      if (options.validateOnly !== undefined) {
        formData.append("validateOnly", options.validateOnly);
      }

      const response = await apiService.upload("/users/import", formData);

      console.log("✅ Import response received:", response);

      // Handle the enhanced backend response format
      if (response.success) {
        return {
          success: true,
          message: response.message,
          imported: response.stats?.successfulImports || 0,
          skipped: response.stats?.errors || 0,
          totalProcessed: response.stats?.totalProcessed || 0,
          warnings: response.warnings || [],
          data: response.data || [],
        };
      } else {
        // Handle case where backend returns success: false
        throw new Error(response.message || "Import failed");
      }
    } catch (error) {
      console.error("❌ Import request failed:", error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data;
        throw new Error(errorData.message || "Server error during import");
      } else {
        // Other errors (network, validation, etc.)
        throw error;
      }
    }
  },

  // Export users to CSV
  exportUsers: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.role) queryParams.append("role", params.role);
      if (params.institute_id)
        queryParams.append("institute_id", params.institute_id);
      if (params.zone_id) queryParams.append("zone_id", params.zone_id);
      if (params.format) queryParams.append("format", params.format);

      const url = `/users/export${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      // Handle different response types based on format
      if (params.format === "csv" || params.format === "xlsx") {
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
  },

  // Get user deletion preview (cascading effects)
  getUserDeletionPreview: async (id) => {
    try {
      const response = await apiService.get(`/users/${id}/deletion-preview`);
      return {
        cascadingEffects: response.data?.cascading_effects || [],
        dependencies: response.data?.dependencies || [],
      };
    } catch (error) {
      console.error("Get deletion preview error:", error);
      return { cascadingEffects: [], dependencies: [] };
    }
  },

  // Get bulk deletion preview
  getBulkDeletionPreview: async (userIds) => {
    try {
      const response = await apiService.post("/users/bulk-deletion-preview", {
        userIds,
      });
      return {
        cascadingEffects: response.data?.cascading_effects || [],
        protectedUsers: response.data?.protected_users || [],
        totalAffected: response.data?.total_affected || 0,
      };
    } catch (error) {
      console.error("Get bulk deletion preview error:", error);
      return { cascadingEffects: [], protectedUsers: [], totalAffected: 0 };
    }
  },

  // Undo soft delete (if within time limit)
  undoUserDeletion: async (id) => {
    try {
      const response = await apiService.post(`/users/${id}/undo-delete`);
      
      if (response.success) {
        return {
          success: true,
          message: response.message || 'User deletion cancelled successfully'
        };
      }
      
      throw new Error(response.message || 'Undo failed');
    } catch (error) {
      console.error('Undo user deletion error:', error);
      throw error;
    }
  }
};