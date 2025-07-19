import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import { analyticsService } from '../services/analytics';
import toast from 'react-hot-toast';
import { 
  ChartBarIcon,
  UsersIcon,
  VideoCameraIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { dateHelpers } from '../utils/helpers';
import classNames from 'classnames';

const Analytics = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState('last30days');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // Fetch analytics data - REAL DATA ONLY
  const { data: analyticsData, loading } = useApi(
    ['analytics', dateRange],
    () => {
      console.log('📊 Fetching analytics data...');
      return analyticsService.getDashboardStats({
        startDate: getDateRangeStart(dateRange),
        endDate: new Date().toISOString(),
      });
    },
    { 
      showErrorToast: false,
      onSuccess: (data) => console.log('✅ Analytics data received:', data),
      onError: (error) => console.log('❌ Analytics API error:', error)
    }
  );

  // Debug log
  console.log('📈 Analytics Response:', analyticsData);
  console.log('⏳ Analytics Loading:', loading);

  // Get start date for selected range
  function getDateRangeStart(range) {
    const now = new Date();
    switch (range) {
      case 'today':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      case 'last7days':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case 'last30days':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      case 'last90days':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    }
  }

  // Handle export
  const handleExportReport = async () => {
    try {
      const exportData = await analyticsService.exportAnalytics({
        type: 'dashboard',
        format: 'json',
        startDate: getDateRangeStart(dateRange),
        endDate: new Date().toISOString(),
      });
      
      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics-${dateRange}-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Analytics report exported successfully');
    } catch (error) {
      toast.error('Failed to export report: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="space-y-6">
      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-green-50 border border-green-200 rounded p-4 text-sm">
          <strong>Analytics Debug Info:</strong>
          <div>Loading: {loading ? 'Yes' : 'No'}</div>
          <div>Data Available: {analyticsData ? 'Yes' : 'No'}</div>
          <div>Date Range: {dateRange}</div>
          {analyticsData && (
            <div>Data Keys: {Object.keys(analyticsData).join(', ')}</div>
          )}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ChartBarIcon className="h-8 w-8 mr-3 text-primary-600" />
            Analytics Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Track platform performance and user engagement metrics
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="form-select"
          >
            <option value="today">Today</option>
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="last90days">Last 90 Days</option>
          </select>
          
          <button onClick={handleExportReport} className="btn btn-outline">
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics - REAL DATA ONLY */}
      <KeyMetrics loading={loading} data={analyticsData} />

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EngagementChart dateRange={dateRange} analyticsData={analyticsData} />
        <UserGrowthChart dateRange={dateRange} analyticsData={analyticsData} />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PopularContent analyticsData={analyticsData} />
        <UserActivity analyticsData={analyticsData} />
        <PerformanceMetrics analyticsData={analyticsData} />
      </div>

      {/* Recent Activity */}
      <RecentAnalytics analyticsData={analyticsData} />
    </div>
  );
};

// Key Metrics Component - REAL DATA ONLY
const KeyMetrics = ({ loading, data }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <ChartBarIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>Analytics data is not available.</p>
          <p className="text-sm">Please ensure the backend API is running.</p>
        </div>
      </div>
    );
  }

  // Extract real metrics from your API test results
  const metrics = [
    {
      name: 'Total Users',
      value: data.totalUsers?.toString() || data.dashboard?.overview?.total_users?.toString() || '0',
      change: data.usersChange || '+0%',
      changeType: 'increase',
      icon: UsersIcon,
      color: 'primary',
    },
    {
      name: 'Total Videos',
      value: data.totalVideos?.toString() || data.dashboard?.overview?.total_videos?.toString() || '0',
      change: data.videosChange || '+0%',
      changeType: 'increase',
      icon: VideoCameraIcon,
      color: 'success',
    },
    {
      name: 'Monthly Views',
      value: data.monthlyViews || data.dashboard?.video_stats?.total_views?.toString() || '0',
      change: data.viewsChange || '+0%',
      changeType: 'increase',
      icon: EyeIcon,
      color: 'warning',
    },
    {
      name: 'Engagement Rate',
      value: data.dashboard?.overview?.engagement_rate || '0%',
      change: data.engagementChange || '+0%',
      changeType: 'increase',
      icon: ArrowTrendingUpIcon,
      color: 'info',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <div key={metric.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className={classNames(
              'flex-shrink-0 p-3 rounded-lg',
              metric.color === 'primary' && 'bg-primary-500 text-white',
              metric.color === 'success' && 'bg-success-500 text-white',
              metric.color === 'warning' && 'bg-warning-500 text-white',
              metric.color === 'info' && 'bg-info-500 text-white'
            )}>
              <metric.icon className="h-6 w-6" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">{metric.name}</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
                <p className={classNames(
                  'ml-2 flex items-baseline text-sm font-semibold',
                  metric.changeType === 'increase' ? 'text-success-600' : 'text-danger-600'
                )}>
                  <ArrowTrendingUpIcon className="self-center flex-shrink-0 h-4 w-4" />
                  {metric.change}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Engagement Chart Component - REAL DATA BASED
const EngagementChart = ({ dateRange, analyticsData }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">User Engagement</h3>
        <p className="text-sm text-gray-500">Based on real data from {dateRange}</p>
      </div>
      <div className="p-6">
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Engagement Chart</p>
            <p className="text-sm text-gray-400">
              {analyticsData?.dashboard?.overview?.engagement_rate 
                ? `Current rate: ${analyticsData.dashboard.overview.engagement_rate}`
                : 'Chart visualization would go here'
              }
            </p>
          </div>
        </div>
        
        {/* Real Data Legend */}
        <div className="mt-4 flex justify-center space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">
              Active Users: {analyticsData?.dashboard?.overview?.active_users || '0'}
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-success-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">
              Engagement: {analyticsData?.dashboard?.overview?.engagement_rate || '0%'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// User Growth Chart Component - REAL DATA BASED
const UserGrowthChart = ({ dateRange, analyticsData }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">User Growth</h3>
        <p className="text-sm text-gray-500">Growth trends for {dateRange}</p>
      </div>
      <div className="p-6">
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <ArrowTrendingUpIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Growth Chart</p>
            <p className="text-sm text-gray-400">
              {analyticsData?.dashboard?.growth?.user_growth_rate 
                ? `Growth rate: ${analyticsData.dashboard.growth.user_growth_rate}`
                : 'Chart visualization would go here'
              }
            </p>
          </div>
        </div>
        
        {/* Real Data Legend */}
        <div className="mt-4 flex justify-center space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-warning-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">
              New Users: {analyticsData?.dashboard?.overview?.new_users_30d || '0'}
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-info-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">
              Total: {analyticsData?.totalUsers || analyticsData?.dashboard?.overview?.total_users || '0'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Popular Content Component - REAL DATA ONLY
const PopularContent = ({ analyticsData }) => {
  // Extract real data from API
  const videoStats = analyticsData?.dashboard?.video_stats;
  const hasData = videoStats && (videoStats.total_views > 0 || videoStats.active_videos > 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Video Performance</h3>
        <p className="text-sm text-gray-500">Real video engagement data</p>
      </div>
      <div className="p-6">
        {hasData ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Total Video Views
                </p>
                <p className="text-lg font-semibold text-primary-600">
                  {videoStats.total_views?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Active Videos
                </p>
                <p className="text-lg font-semibold text-success-600">
                  {videoStats.active_videos || '0'}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  New Videos (30 days)
                </p>
                <p className="text-lg font-semibold text-warning-600">
                  {videoStats.new_videos_30_days || '0'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No video data</h3>
            <p className="mt-1 text-sm text-gray-500">Video statistics will appear here when available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// User Activity Component - REAL DATA BASED
const UserActivity = ({ analyticsData }) => {
  const userStats = analyticsData?.dashboard?.user_stats;
  const hasData = userStats && userStats.by_role;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">User Distribution</h3>
        <p className="text-sm text-gray-500">Real user activity by role</p>
      </div>
      <div className="p-6">
        {hasData ? (
          <div className="space-y-4">
            {Object.entries(userStats.by_role).map(([role, count]) => (
              <div key={role} className="flex items-center">
                <div className="w-20 text-sm text-gray-600 capitalize">{role.replace('_', ' ')}</div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min((count / Math.max(...Object.values(userStats.by_role))) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div className="w-8 text-sm text-gray-900 text-right">{count}</div>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Active last 7 days:</span>
                <span className="font-medium text-gray-900">{userStats.active_last_7_days || '0'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No user data</h3>
            <p className="mt-1 text-sm text-gray-500">User activity will appear here when available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Performance Metrics Component - REAL DATA ONLY
const PerformanceMetrics = ({ analyticsData }) => {
  const overview = analyticsData?.dashboard?.overview;
  const growth = analyticsData?.dashboard?.growth;

  const metrics = [
    { 
      name: 'Total Users', 
      value: overview?.total_users?.toString() || '0', 
      change: growth?.user_growth_rate || '+0%', 
      type: 'increase' 
    },
    { 
      name: 'Active Rate', 
      value: overview?.active_percentage ? `${overview.active_percentage}%` : '0%', 
      change: '+0%', 
      type: 'increase' 
    },
    { 
      name: 'Engagement', 
      value: overview?.engagement_rate || '0%', 
      change: growth?.engagement_trend === 'stable' ? '→' : '+0%', 
      type: 'increase' 
    },
    { 
      name: 'New Users (30d)', 
      value: overview?.new_users_30d?.toString() || '0', 
      change: '+0%', 
      type: 'increase' 
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Performance Metrics</h3>
        <p className="text-sm text-gray-500">Real platform performance indicators</p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{metric.name}</p>
                <p className="text-lg font-semibold text-gray-900">{metric.value}</p>
              </div>
              <div className={classNames(
                'text-sm font-medium',
                metric.type === 'increase' ? 'text-success-600' : 'text-danger-600'
              )}>
                {metric.change}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Recent Analytics Component - REAL DATA BASED
const RecentAnalytics = ({ analyticsData }) => {
  const recentEvents = [];

  // Generate real events based on actual data
  if (analyticsData?.totalUsers) {
    recentEvents.push({
      type: 'milestone',
      title: `Platform has ${analyticsData.totalUsers} registered users`,
      description: 'Current total user count from database',
      time: 'Real-time',
      icon: UsersIcon,
      color: 'text-success-600',
    });
  }

  if (analyticsData?.totalVideos) {
    recentEvents.push({
      type: 'content',
      title: `${analyticsData.totalVideos} videos available`,
      description: 'Total educational content in platform',
      time: 'Real-time',
      icon: VideoCameraIcon,
      color: 'text-primary-600',
    });
  }

  if (analyticsData?.dashboard?.overview?.engagement_rate) {
    recentEvents.push({
      type: 'engagement',
      title: `${analyticsData.dashboard.overview.engagement_rate} engagement rate`,
      description: 'Current user engagement level',
      time: 'Real-time',
      icon: ArrowTrendingUpIcon,
      color: 'text-warning-600',
    });
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Real-time Insights</h3>
        <p className="text-sm text-gray-500">Live data from your backend</p>
      </div>
      <div className="p-6">
        {recentEvents.length > 0 ? (
          <div className="space-y-4">
            {recentEvents.map((event, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={classNames('flex-shrink-0 p-2 rounded-lg bg-gray-100', event.color)}>
                  <event.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-500">{event.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No insights available</h3>
            <p className="mt-1 text-sm text-gray-500">Real-time insights will appear here when data is available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;