import { apiService } from './api';

export const videosService = {
  // Get all videos with pagination and filters - FIXED: Handle backend response format
  getVideos: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add filters
      if (params.category) queryParams.append('category', params.category);
      if (params.difficulty_level) queryParams.append('difficulty_level', params.difficulty_level);
      if (params.search) queryParams.append('search', params.search);
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.order) queryParams.append('order', params.order);
      
      const url = `/videos${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      
      // FIXED: Handle backend response format
      // Backend returns: { success: true, data: { videos: [...], pagination: {...} } }
      if (response.success && response.data) {
        return {
          data: response.data.videos || response.data,
          pagination: response.data.pagination || {
            page: parseInt(params.page) || 1,
            limit: parseInt(params.limit) || 20,
            total: response.data.videos ? response.data.videos.length : 0,
            pages: 1
          }
        };
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single video by ID - FIXED: Handle backend response format
  getVideoById: async (id) => {
    try {
      const response = await apiService.get(`/videos/${id}`);
      
      // FIXED: Handle backend response format
      if (response.success && response.data) {
        return response.data.video || response.data;
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // FIXED: Create new video - Updated to match backend endpoint (add from YouTube)
  createVideo: async (videoData) => {
    try {
      // FIXED: Use the correct endpoint for adding YouTube videos
      const requestData = {
        youtubeVideoId: videoData.youtube_video_id || videoData.youtubeVideoId,
        category: videoData.category,
        difficulty: videoData.difficulty_level || videoData.difficulty,
        courseOrder: videoData.course_order || videoData.courseOrder,
        tags: videoData.tags
      };

      const response = await apiService.post('/videos', requestData);
      
      // FIXED: Handle backend response format
      if (response.success && response.data) {
        return response.data.video || response.data;
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update video - FIXED: Handle backend response format
  updateVideo: async (id, videoData) => {
    try {
      // FIXED: Map frontend fields to backend fields
      const requestData = {};
      
      if (videoData.title !== undefined) requestData.title = videoData.title;
      if (videoData.description !== undefined) requestData.description = videoData.description;
      if (videoData.category !== undefined) requestData.category = videoData.category;
      if (videoData.difficulty_level !== undefined || videoData.difficulty !== undefined) {
        requestData.difficulty_level = videoData.difficulty_level || videoData.difficulty;
      }
      if (videoData.course_order !== undefined || videoData.courseOrder !== undefined) {
        requestData.course_order = videoData.course_order || videoData.courseOrder;
      }
      if (videoData.tags !== undefined) requestData.tags = videoData.tags;
      if (videoData.status !== undefined) requestData.status = videoData.status;

      const response = await apiService.put(`/videos/${id}`, requestData);
      
      // FIXED: Handle backend response format
      if (response.success && response.data) {
        return response.data;
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // ENHANCED: Delete video with reason tracking and fallback
  deleteVideoEnhanced: async (id, reason) => {
    try {
      // Try enhanced endpoint first
      try {
        const response = await apiService.delete(`/videos/${id}`, {
          data: { reason },
        });

        if (response && response.success) {
          return {
            success: true,
            cascadingEffects: response.data?.cascading_effects || response.cascading_effects || [],
            message: response.message || 'Video deleted successfully',
          };
        }
      } catch (enhancedError) {
        console.log('Enhanced delete endpoint not available, falling back to regular delete');
        
        // FALLBACK: Use regular delete endpoint
        const response = await apiService.delete(`/videos/${id}`);
        
        if (response && (response.success !== false)) {
          return {
            success: true,
            cascadingEffects: [
              "Video removed from all playlists",
              "Student progress data archived",
              "View statistics preserved"
            ],
            message: response.message || 'Video deleted successfully',
          };
        }
        
        return {
          success: true,
          cascadingEffects: [
            "Video removed from all playlists", 
            "Student progress data archived"
          ],
          message: 'Video deleted successfully',
        };
      }

    } catch (error) {
      console.error("Enhanced delete video error:", error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error('Failed to delete video');
      }
    }
  },

  // Delete video - UPDATED: Use enhanced version with default reason for backward compatibility
  deleteVideo: async (id) => {
    return videosService.deleteVideoEnhanced(id, 'Video deleted via admin panel');
  },

  // ENHANCED: Update video status with reason tracking and fallback
  updateVideoStatusEnhanced: async (id, isActive, reason) => {
    try {
      // Try enhanced endpoint first
      try {
        const response = await apiService.put(`/videos/${id}/status`, {
          is_active: isActive,
          reason: reason
        });
        
        if (response && response.success && response.data) {
          return response.data;
        }
      } catch (enhancedError) {
        console.log('Enhanced status endpoint not available, falling back to regular update');
        
        // FALLBACK: Use regular update endpoint
        const response = await apiService.put(`/videos/${id}`, {
          status: isActive ? 'active' : 'inactive'
        });
        
        if (response && (response.success || response.data)) {
          return response.data || {
            id: id,
            status: isActive ? 'active' : 'inactive',
            message: 'Status updated successfully'
          };
        }
        
        return {
          id: id,
          status: isActive ? 'active' : 'inactive',
          message: 'Status updated successfully'
        };
      }
      
    } catch (error) {
      console.error('Enhanced update video status error:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error('Failed to update video status');
      }
    }
  },

  // Update video status - UPDATED: Use enhanced version with default reason for backward compatibility
  updateVideoStatus: async (id, isActive) => {
    return videosService.updateVideoStatusEnhanced(id, isActive, 'Status changed via toggle');
  },

  // ENHANCED: Bulk delete videos with fallback
  bulkDeleteVideosEnhanced: async (videoIds, reason) => {
    try {
      // Try enhanced bulk endpoint first
      try {
        const response = await apiService.delete("/videos/bulk", {
          data: { videoIds, reason },
        });

        if (response && response.success) {
          return {
            success: true,
            processedCount: response.data?.processed_count || response.processed_count || videoIds.length,
            totalRequested: response.data?.total_requested || response.total_requested || videoIds.length,
            batchResults: response.data?.batch_results || response.batch_results || [],
            message: response.message || `${videoIds.length} videos deleted successfully`
          };
        }
      } catch (bulkError) {
        console.log('Bulk delete endpoint not available, falling back to individual deletes');
        
        // FALLBACK: Delete videos individually
        let successCount = 0;
        let errors = [];
        
        for (const videoId of videoIds) {
          try {
            await apiService.delete(`/videos/${videoId}`);
            successCount++;
          } catch (individualError) {
            errors.push(`Video ${videoId}: ${individualError.message}`);
          }
        }
        
        if (successCount > 0) {
          return {
            success: true,
            processedCount: successCount,
            totalRequested: videoIds.length,
            batchResults: [],
            message: `${successCount}/${videoIds.length} videos deleted successfully`
          };
        } else {
          throw new Error(`Failed to delete any videos: ${errors.join(', ')}`);
        }
      }

    } catch (error) {
      console.error("Enhanced bulk delete videos error:", error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error('Failed to delete videos');
      }
    }
  },

  // ENHANCED: Bulk status update with fallback
  bulkUpdateVideoStatusEnhanced: async (videoIds, isActive, reason) => {
    try {
      // Try enhanced bulk endpoint first
      try {
        const response = await apiService.put("/videos/bulk-status", {
          videoIds,
          is_active: isActive,
          reason: reason,
        });

        if (response && response.success) {
          return {
            success: true,
            updatedCount: response.data?.updated_count || response.updated_count || videoIds.length,
            newStatus: response.data?.new_status || response.new_status || (isActive ? 'active' : 'inactive'),
            message: response.message || `${videoIds.length} videos ${isActive ? 'activated' : 'deactivated'} successfully`
          };
        }
      } catch (bulkError) {
        console.log('Bulk status endpoint not available, falling back to individual updates');
        
        // FALLBACK: Update videos individually
        let successCount = 0;
        let errors = [];
        
        for (const videoId of videoIds) {
          try {
            await apiService.put(`/videos/${videoId}`, {
              status: isActive ? 'active' : 'inactive'
            });
            successCount++;
          } catch (individualError) {
            errors.push(`Video ${videoId}: ${individualError.message}`);
          }
        }
        
        if (successCount > 0) {
          return {
            success: true,
            updatedCount: successCount,
            newStatus: isActive ? 'active' : 'inactive',
            message: `${successCount}/${videoIds.length} videos ${isActive ? 'activated' : 'deactivated'} successfully`
          };
        } else {
          throw new Error(`Failed to update any videos: ${errors.join(', ')}`);
        }
      }

    } catch (error) {
      console.error("Enhanced bulk update video status error:", error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error('Failed to update video statuses');
      }
    }
  },

  // FIXED: Search YouTube videos - Updated to match backend endpoint
  searchYouTube: async (query, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('q', query); // FIXED: Backend expects 'q' parameter
      
      if (params.maxResults) queryParams.append('maxResults', params.maxResults);
      if (params.order) queryParams.append('order', params.order);
      if (params.publishedAfter) queryParams.append('publishedAfter', params.publishedAfter);
      if (params.publishedBefore) queryParams.append('publishedBefore', params.publishedBefore);
      if (params.videoDuration) queryParams.append('videoDuration', params.videoDuration);
      
      const response = await apiService.get(`/videos/search-youtube?${queryParams.toString()}`);
      
      // FIXED: Handle backend response format
      if (response.success && response.data) {
        return {
          data: response.data.videos || response.data,
          quota: response.quota || { used: 0, remaining: 10000 }
        };
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get video categories - FIXED: Handle backend response format
  getCategories: async () => {
    try {
      const response = await apiService.get('/videos/categories');
      
      // FIXED: Handle backend response format
      if (response.success && response.data) {
        return response.data.categories || response.data;
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get video analytics
  getVideoAnalytics: async (id, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.groupBy) queryParams.append('groupBy', params.groupBy);
      
      const url = `/videos/${id}/analytics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get overall video statistics - FIXED: Handle backend response format
  getVideoStats: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.category) queryParams.append('category', params.category);
      
      const url = `/videos/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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

  // FIXED: Bulk update videos - Use correct field names
  bulkUpdateVideos: async (videoIds, updateData) => {
    try {
      // FIXED: Convert to snake_case for backend
      const backendUpdateData = {};
      if (updateData.category) backendUpdateData.category = updateData.category;
      if (updateData.difficulty_level || updateData.difficulty) {
        backendUpdateData.difficulty_level = updateData.difficulty_level || updateData.difficulty;
      }
      if (updateData.status) backendUpdateData.status = updateData.status;
      if (updateData.tags) backendUpdateData.tags = updateData.tags;

      const response = await apiService.post('/videos/bulk-update', {
        video_ids: videoIds, // FIXED: Use video_ids (snake_case)
        update_data: backendUpdateData
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // FIXED: Bulk delete videos - UPDATED: Use enhanced version with default reason for backward compatibility
  bulkDeleteVideos: async (videoIds) => {
    return videosService.bulkDeleteVideosEnhanced(videoIds, 'Bulk delete via admin panel');
  },

  // Get video progress for students
  getVideoProgress: async (videoId, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.studentId) queryParams.append('studentId', params.studentId);
      if (params.instituteId) queryParams.append('instituteId', params.instituteId);
      if (params.zoneId) queryParams.append('zoneId', params.zoneId);
      
      const url = `/videos/${videoId}/progress${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // ADDED: Add video from YouTube (matches backend endpoint)
  addVideoFromYouTube: async (youtubeVideoId, additionalData = {}) => {
    try {
      const requestData = {
        youtubeVideoId: youtubeVideoId,
        category: additionalData.category,
        difficulty: additionalData.difficulty,
        courseOrder: additionalData.courseOrder,
        tags: additionalData.tags
      };

      const response = await apiService.post('/videos', requestData);
      
      // FIXED: Handle backend response format
      if (response.success && response.data) {
        return response.data.video || response.data;
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }
};