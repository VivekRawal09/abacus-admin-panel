import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePaginatedApi } from '../hooks/useApi';
import { videosService } from '../services/videos';
import DataTable from '../components/common/DataTable';
import SearchInput from '../components/common/SearchInput';
import { PermissionGate } from '../components/auth/ProtectedRoute';
import toast from 'react-hot-toast';
import { 
  PlusIcon,
  VideoCameraIcon,
  PlayIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CloudArrowUpIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { VIDEO_CATEGORY_LABELS, DIFFICULTY_LABELS } from '../utils/constants';
import { dateHelpers, numberHelpers } from '../utils/helpers';
import classNames from 'classnames';

const Videos = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    difficulty_level: '',
    status: '',
  });

  // Fetch videos with pagination - REAL DATA ONLY
  const {
    data: videosResponse,
    loading,
    error,
    refetch,
    params,
    updateParams,
    goToPage,
    changePageSize,
  } = usePaginatedApi(
    'videos',
    (params) => videosService.getVideos({
      ...params,
      search: searchTerm,
      ...filters,
    }),
    {
      page: 1,
      limit: 20,
    }
  );

  // Debug log to see what we're getting
  console.log('🎥 Videos API Response:', videosResponse);
  console.log('📊 Loading:', loading);
  console.log('❌ Error:', error);

  // Check if loading is undefined, default to false
  const isLoading = loading === undefined ? false : loading;

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    updateParams({ search: term, page: 1 });
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateParams({ ...newFilters, page: 1 });
  };

  // Handle video actions
  const handleAddVideo = () => {
    toast('Add video functionality will be implemented. For now, use the backend API directly.', {
      icon: '🎬',
    });
  };

  const handleYouTubeSearch = () => {
    toast('YouTube search functionality will be implemented. For now, use the backend API directly.', {
      icon: '🔍',
    });
  };

  const handleEditVideo = (videoId) => {
    toast(`Edit video ${videoId} - functionality will be implemented`, {
      icon: '✏️',
    });
  };

  const handleDeleteVideo = (videoId) => {
    toast(`Delete video ${videoId} - functionality will be implemented`, {
      icon: '🗑️',
    });
  };

  const handleViewVideo = (video) => {
    if (video.youtube_video_id) {
      window.open(`https://youtube.com/watch?v=${video.youtube_video_id}`, '_blank');
    } else {
      toast('No YouTube video ID available', {
        icon: '❌',
      });
    }
  };

  // Table columns configuration
  const columns = [
    {
      key: 'title',
      title: 'Video',
      sortable: true,
      render: (value, video) => (
        <div className="flex items-center">
          <div className="h-16 w-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
            {video.thumbnail_url ? (
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <PlayIcon className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="ml-4 flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {video.title}
            </div>
            <div className="text-sm text-gray-500 truncate">
              {video.description}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Duration: {video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : 'N/A'}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      title: 'Category',
      sortable: true,
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
          {VIDEO_CATEGORY_LABELS[value] || value || 'Uncategorized'}
        </span>
      ),
    },
    {
      key: 'difficulty_level',
      title: 'Difficulty',
      sortable: true,
      render: (value) => {
        const colors = {
          beginner: 'bg-green-100 text-green-800',
          elementary: 'bg-blue-100 text-blue-800',
          intermediate: 'bg-yellow-100 text-yellow-800',
          advanced: 'bg-orange-100 text-orange-800',
          expert: 'bg-red-100 text-red-800',
        };
        
        return (
          <span className={classNames(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            colors[value] || 'bg-gray-100 text-gray-800'
          )}>
            {DIFFICULTY_LABELS[value] || value || 'Not Set'}
          </span>
        );
      },
    },
    {
      key: 'view_count',
      title: 'Views',
      sortable: true,
      render: (value) => numberHelpers.formatNumber(value || 0),
    },
    {
      key: 'published_date',
      title: 'Published',
      sortable: true,
      render: (value) => dateHelpers.formatDate(value),
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value, video) => {
        const isActive = video.status === 'active';
        return (
          <span className={classNames(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            isActive ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'
          )}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      },
    },
    {
      key: 'actions',
      title: 'Actions',
      actions: [
        {
          label: 'View',
          icon: EyeIcon,
          onClick: (video) => handleViewVideo(video),
        },
        // Only show edit/delete for admins
        ...(user && ['super_admin', 'institute_admin', 'zone_manager'].includes(user.role) ? [
          {
            label: 'Edit',
            icon: PencilIcon,
            onClick: (video) => handleEditVideo(video.id),
          },
          {
            label: 'Delete',
            icon: TrashIcon,
            variant: 'danger',
            onClick: (video) => handleDeleteVideo(video.id),
          },
        ] : [])
      ],
    },
  ];

  // Quick actions - ROLE BASED
  const quickActions = [];

  // Only add admin actions for admin users
  if (user && ['super_admin', 'institute_admin', 'zone_manager'].includes(user.role)) {
    quickActions.push(
      {
        label: 'Add Video',
        icon: PlusIcon,
        onClick: handleAddVideo,
        className: 'btn-primary',
      },
      {
        label: 'YouTube Import',
        icon: CloudArrowUpIcon,
        onClick: handleYouTubeSearch,
        className: 'btn-success',
      },
      {
        label: 'Bulk Upload',
        onClick: () => toast('Bulk upload functionality will be implemented', {
          icon: '📤',
        }),
        className: 'btn-outline',
      }
    );
  }

  // REAL DATA ONLY - Extract from backend response
  let displayData = [];
  let pagination = {
    currentPage: 1,
    totalPages: 1,
    pageSize: 20,
    totalItems: 0,
  };

  // Handle the exact API response format from your test results
  if (videosResponse?.data?.videos && Array.isArray(videosResponse.data.videos)) {
    displayData = videosResponse.data.videos;
    pagination = videosResponse.data.pagination || pagination;
  } else if (videosResponse?.videos && Array.isArray(videosResponse.videos)) {
    displayData = videosResponse.videos;
    pagination = videosResponse.pagination || pagination;
  } else if (videosResponse?.data && Array.isArray(videosResponse.data)) {
    displayData = videosResponse.data;
    pagination = videosResponse.pagination || pagination;
  } else if (videosResponse && Array.isArray(videosResponse)) {
    // Sometimes API might return array directly
    displayData = videosResponse;
  }

  console.log('🎬 Final display data:', displayData);
  console.log('📄 Final pagination:', pagination);

  return (
    <div className="space-y-6">
      {/* Debug Info (remove after testing) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-purple-50 border border-purple-200 rounded p-4 text-sm">
          <strong>Videos Debug Info:</strong>
          <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
          <div>Error: {error ? error.message : 'None'}</div>
          <div>Videos Count: {displayData.length}</div>
          <div>API Response Type: {videosResponse ? typeof videosResponse : 'undefined'}</div>
          <div>Response Structure: {videosResponse ? Object.keys(videosResponse).join(', ') : 'N/A'}</div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <VideoCameraIcon className="h-8 w-8 mr-3 text-primary-600" />
            Video Management
          </h1>
          <p className="mt-2 text-gray-600">
            Manage educational videos and learning content
          </p>
        </div>
        
        <PermissionGate permission="videos">
          <div className="mt-4 sm:mt-0 flex space-x-3">
            {/* Only show admin buttons for admins */}
            {user && ['super_admin', 'institute_admin', 'zone_manager'].includes(user.role) && (
              <>
                <button onClick={handleYouTubeSearch} className="btn btn-outline">
                  <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                  YouTube Search
                </button>
                <button onClick={handleAddVideo} className="btn btn-primary">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Video
                </button>
              </>
            )}
          </div>
        </PermissionGate>
      </div>

      {/* Stats Cards - ONLY FOR ADMINS */}
      {user && ['super_admin', 'institute_admin', 'zone_manager'].includes(user.role) && (
        <VideoStatsCards />
      )}

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-lg">
            <SearchInput
              placeholder="Search videos by title, description, or category..."
              value={searchTerm}
              onChange={setSearchTerm}
              onSearch={handleSearch}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="form-select"
            >
              <option value="">All Categories</option>
              <option value="basic">Basic</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="tutorial">Tutorial</option>
              <option value="practice">Practice</option>
            </select>

            <select
              value={filters.difficulty_level}
              onChange={(e) => handleFilterChange('difficulty_level', e.target.value)}
              className="form-select"
            >
              <option value="">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="elementary">Elementary</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="form-select"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Videos Table - REAL DATA ONLY */}
      <DataTable
        data={displayData}
        columns={columns}
        loading={isLoading}
        error={error}
        pagination={pagination}
        onPageChange={goToPage}
        onPageSizeChange={changePageSize}
        onSearch={handleSearch}
        actions={quickActions}
        searchPlaceholder="Search videos..."
        emptyMessage="No videos found. Try adjusting your search or filters."
        className="bg-white"
      />
    </div>
  );
};

// Video Statistics Cards Component - REAL DATA ONLY
const VideoStatsCards = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch real video stats from backend - ONLY FOR ADMINS
  React.useEffect(() => {
    const fetchVideoStats = async () => {
      try {
        // Check if user has permission to view stats
        if (!user || !['super_admin', 'institute_admin', 'zone_manager'].includes(user.role)) {
          console.log('📊 User role does not have permission for video stats');
          setStats(null);
          setLoading(false);
          return;
        }

        console.log('📊 Fetching video stats...');
        const videoStats = await videosService.getVideoStats();
        console.log('✅ Video stats received:', videoStats);
        setStats(videoStats);
      } catch (error) {
        console.error('❌ Failed to fetch video stats:', error);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoStats();
  }, [user]);

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

  if (!stats) {
    // For non-admin users, show a simplified view instead of error
    if (user && ['parent', 'student'].includes(user.role)) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center text-gray-500">
            <VideoCameraIcon className="h-12 w-12 mx-auto mb-4 text-primary-400" />
            <p className="text-lg font-medium text-gray-900">Educational Videos</p>
            <p className="text-sm">Explore our collection of learning videos below.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <VideoCameraIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>Video statistics are not available.</p>
          <p className="text-sm">Please ensure you have the required permissions.</p>
        </div>
      </div>
    );
  }

  const displayStats = [
    {
      name: 'Total Videos',
      value: stats.total_videos?.toString() || '0',
      change: 'N/A',
      icon: VideoCameraIcon,
      color: 'primary',
    },
    {
      name: 'Active Videos',
      value: stats.active_videos?.toString() || '0',
      change: 'N/A',
      color: 'success',
    },
    {
      name: 'Total Views',
      value: stats.total_views ? numberHelpers.formatNumber(stats.total_views) : '0',
      change: 'N/A',
      color: 'warning',
    },
    {
      name: 'Categories',
      value: stats.by_category ? Object.keys(stats.by_category).length.toString() : '0',
      change: 'N/A',
      color: 'info',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {displayStats.map((stat) => (
        <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            {stat.icon && (
              <div className={classNames(
                'flex-shrink-0 p-3 rounded-lg',
                stat.color === 'primary' && 'bg-primary-500 text-white',
                stat.color === 'success' && 'bg-success-500 text-white',
                stat.color === 'warning' && 'bg-warning-500 text-white',
                stat.color === 'info' && 'bg-info-500 text-white'
              )}>
                <stat.icon className="h-6 w-6" />
              </div>
            )}
            <div className={classNames('flex-1', stat.icon ? 'ml-4' : '')}>
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Videos;