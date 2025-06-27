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

  // Delete video - FIXED: Handle backend response format
  deleteVideo: async (id) => {
    try {
      const response = await apiService.delete(`/videos/${id}`);
      
      // FIXED: Handle backend response format
      if (response.success) {
        return { success: true, message: response.message || 'Video deleted successfully' };
      }
      
      return response;
    } catch (error) {
      throw error;
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

  // FIXED: Bulk delete videos - Use correct field names and endpoint
  bulkDeleteVideos: async (videoIds) => {
    try {
      const response = await apiService.post('/videos/bulk-delete', {
        videoIds: videoIds // FIXED: Use correct field name for bulk delete
      });
      
      // FIXED: Handle backend response format
      if (response.success) {
        return { success: true, message: response.message || 'Videos deleted successfully' };
      }
      
      return response;
    } catch (error) {
      throw error;
    }
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
  },

  // ADDED: Update video status (activate/deactivate)
  updateVideoStatus: async (id, isActive) => {
    try {
      const response = await apiService.put(`/videos/${id}`, {
        status: isActive ? 'active' : 'inactive'
      });
      
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