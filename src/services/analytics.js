import { apiService } from './api';

export const analyticsService = {
  // FIXED: Get dashboard overview statistics - Updated to match backend endpoint
  getDashboardStats: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.institute_id) queryParams.append('institute_id', params.institute_id);
      if (params.zone_id) queryParams.append('zone_id', params.zone_id);
      
      // FIXED: Changed from /analytics/dashboard to /analytics/dashboard-stats
      const url = `/analytics/dashboard-stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // FIXED: Get user engagement analytics - Updated to match backend endpoint
  getUserEngagement: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.institute_id) queryParams.append('institute_id', params.institute_id);
      if (params.zone_id) queryParams.append('zone_id', params.zone_id);
      if (params.role) queryParams.append('role', params.role);
      if (params.groupBy) queryParams.append('groupBy', params.groupBy);
      
      // FIXED: Use correct endpoint that matches backend
      const url = `/analytics/user-engagement${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // FIXED: Get video performance analytics - Updated to match backend endpoint
  getVideoPerformance: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.category) queryParams.append('category', params.category);
      if (params.difficulty_level) queryParams.append('difficulty_level', params.difficulty_level);
      if (params.institute_id) queryParams.append('institute_id', params.institute_id);
      if (params.zone_id) queryParams.append('zone_id', params.zone_id);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.sort) queryParams.append('sort', params.sort);
      
      // FIXED: Use correct endpoint that matches backend
      const url = `/analytics/video-performance${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // ADDED: Export analytics - New function to match backend capability
  exportAnalytics: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.type) queryParams.append('type', params.type);
      if (params.format) queryParams.append('format', params.format);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      
      const url = `/analytics/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get learning progress analytics
  getLearningProgress: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.student_id) queryParams.append('student_id', params.student_id);
      if (params.institute_id) queryParams.append('institute_id', params.institute_id);
      if (params.zone_id) queryParams.append('zone_id', params.zone_id);
      if (params.grade) queryParams.append('grade', params.grade);
      if (params.groupBy) queryParams.append('groupBy', params.groupBy);
      
      const url = `/analytics/learning-progress${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get assessment analytics
  getAssessmentAnalytics: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.assessment_id) queryParams.append('assessment_id', params.assessment_id);
      if (params.institute_id) queryParams.append('institute_id', params.institute_id);
      if (params.zone_id) queryParams.append('zone_id', params.zone_id);
      if (params.grade) queryParams.append('grade', params.grade);
      if (params.groupBy) queryParams.append('groupBy', params.groupBy);
      
      const url = `/analytics/assessments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get system usage analytics
  getSystemUsage: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.institute_id) queryParams.append('institute_id', params.institute_id);
      if (params.zone_id) queryParams.append('zone_id', params.zone_id);
      if (params.groupBy) queryParams.append('groupBy', params.groupBy);
      if (params.metric) queryParams.append('metric', params.metric);
      
      const url = `/analytics/system-usage${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get real-time analytics
  getRealTimeAnalytics: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.institute_id) queryParams.append('institute_id', params.institute_id);
      if (params.zone_id) queryParams.append('zone_id', params.zone_id);
      if (params.timeframe) queryParams.append('timeframe', params.timeframe);
      
      const url = `/analytics/real-time${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get top performers
  getTopPerformers: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.institute_id) queryParams.append('institute_id', params.institute_id);
      if (params.zone_id) queryParams.append('zone_id', params.zone_id);
      if (params.grade) queryParams.append('grade', params.grade);
      if (params.metric) queryParams.append('metric', params.metric);
      if (params.limit) queryParams.append('limit', params.limit);
      
      const url = `/analytics/top-performers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get learning trends
  getLearningTrends: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.institute_id) queryParams.append('institute_id', params.institute_id);
      if (params.zone_id) queryParams.append('zone_id', params.zone_id);
      if (params.period) queryParams.append('period', params.period);
      if (params.metric) queryParams.append('metric', params.metric);
      
      const url = `/analytics/learning-trends${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get content analytics
  getContentAnalytics: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.content_type) queryParams.append('content_type', params.content_type);
      if (params.category) queryParams.append('category', params.category);
      if (params.institute_id) queryParams.append('institute_id', params.institute_id);
      if (params.zone_id) queryParams.append('zone_id', params.zone_id);
      if (params.groupBy) queryParams.append('groupBy', params.groupBy);
      
      const url = `/analytics/content${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Generate custom report
  generateReport: async (reportConfig) => {
    try {
      const response = await apiService.post('/analytics/reports', {
        report_type: reportConfig.type,
        parameters: reportConfig.parameters,
        format: reportConfig.format || 'json',
        include_charts: reportConfig.includeCharts || false,
        email_to: reportConfig.emailTo,
        schedule: reportConfig.schedule
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get saved reports
  getSavedReports: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.report_type) queryParams.append('report_type', params.report_type);
      if (params.created_by) queryParams.append('created_by', params.created_by);
      
      const url = `/analytics/reports${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Download report
  downloadReport: async (reportId, format = 'pdf') => {
    try {
      const response = await apiService.get(`/analytics/reports/${reportId}/download`, {
        params: { format },
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get comparative analytics
  getComparativeAnalytics: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.entity_type) queryParams.append('entity_type', params.entity_type);
      if (params.entity_ids) queryParams.append('entity_ids', params.entity_ids.join(','));
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.metrics) queryParams.append('metrics', params.metrics.join(','));
      
      const url = `/analytics/comparative${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get predictive analytics
  getPredictiveAnalytics: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.model_type) queryParams.append('model_type', params.model_type);
      if (params.prediction_period) queryParams.append('prediction_period', params.prediction_period);
      if (params.entity_id) queryParams.append('entity_id', params.entity_id);
      if (params.entity_type) queryParams.append('entity_type', params.entity_type);
      
      const url = `/analytics/predictive${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }
};