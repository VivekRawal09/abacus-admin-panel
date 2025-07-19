import React, { useState, useEffect, memo, useMemo, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { usePaginatedApi } from "../hooks/useApi";
import { videosService } from "../services/videos";
import { useCrud } from "../hooks/useCrud";
import DataTable from "../components/common/DataTable";
import SearchInput from "../components/common/SearchInput";
import CrudModal from "../components/common/CrudModal";
import BulkActions from "../components/common/BulkActions";
import YouTubeSearchModal from "../components/common/YouTubeSearchModal";
import { PermissionGate } from "../components/auth/ProtectedRoute";
import toast from "react-hot-toast";
import EnhancedConfirmModal from "../components/common/EnhancedConfirmModal";
import EnhancedStatusToggle from "../components/common/EnhancedStatusToggle";
import EnhancedDeleteButton from "../components/common/EnhancedDeleteButton";
import {
  PlusIcon,
  VideoCameraIcon,
  PlayIcon,
  PencilIcon,
  EyeIcon,
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  FireIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  VIDEO_CATEGORY_LABELS,
  DIFFICULTY_LABELS,
  VIDEO_CATEGORIES,
  DIFFICULTY_LEVELS,
} from "../utils/constants";
import { dateHelpers, numberHelpers, stringHelpers } from "../utils/helpers";
import classNames from "classnames";

/**
 * Videos Management Page - Performance Optimized
 * Enhanced with React.memo, useMemo, useCallback for better performance
 */
const Videos = memo(() => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    difficulty_level: "",
    status: "",
  });
  const [videoStats, setVideoStats] = useState(null);
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);

  // Memoized API parameters to prevent unnecessary re-renders
  const apiParams = useMemo(() => ({
    search: searchTerm,
    ...filters,
  }), [searchTerm, filters]);

  // Fetch videos with pagination
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
    "videos",
    useCallback((params) => videosService.getVideos({ ...params, ...apiParams }), [apiParams]),
    {
      page: 1,
      limit: 20,
    }
  );

  // CRUD functionality with enhanced delete
  const {
    isModalOpen,
    modalMode,
    selectedItem,
    loading: crudLoading,
    fieldConfig,
    config,
    selectedItems,
    handleCreate,
    handleEdit,
    handleView,
    handleCloseModal,
    handleSubmit,
    handleSelectionChange,
    handleSelectAll,
    handleClearSelection,
    showEnhancedDelete,
    deleteTarget,
    cascadingEffects,
    handleDeleteEnhanced,
    handleConfirmEnhancedDelete,
    handleStatusChangeEnhanced,
    handleBulkActionEnhanced,
  } = useCrud("video", videosService, refetch);

  const isLoading = loading === undefined ? false : loading;

  // Memoized user permissions check
  const userPermissions = useMemo(() => {
    const isAdmin = user && ["super_admin", "institute_admin", "zone_manager"].includes(user.role);
    return { isAdmin };
  }, [user]);

  // Memoized video statistics fetch
  const fetchStats = useCallback(async () => {
    try {
      if (!userPermissions.isAdmin) {
        return;
      }
      console.log("📊 Fetching video stats...");
      const stats = await videosService.getVideoStats();
      console.log("✅ Video stats received:", stats);
      setVideoStats(stats);
    } catch (error) {
      console.error("❌ Failed to fetch video stats:", error);
      setVideoStats(null);
    }
  }, [userPermissions.isAdmin]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Memoized event handlers
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    updateParams({ search: term, page: 1 });
  }, [updateParams]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      updateParams({ ...newFilters, page: 1 });
      return newFilters;
    });
  }, [updateParams]);

  const handleYouTubeSearch = useCallback(() => {
    setShowYouTubeModal(true);
  }, []);

  const handleYouTubeImport = useCallback(async (videoData) => {
    try {
      await videosService.addVideoFromYouTube(videoData.youtubeVideoId, {
        category: videoData.category,
        difficulty: videoData.difficulty,
        courseOrder: videoData.courseOrder,
        tags: videoData.tags,
      });
      toast.success("Video imported successfully from YouTube!");
      refetch();
      setShowYouTubeModal(false);
    } catch (error) {
      console.error("YouTube import error:", error);
      toast.error(
        "Failed to import video: " +
          (error.response?.data?.message || error.message)
      );
    }
  }, [refetch]);

  const handleViewVideo = useCallback((video) => {
    if (video.youtube_video_id || video.youtubeVideoId) {
      const videoId = video.youtube_video_id || video.youtubeVideoId;
      window.open(`https://youtube.com/watch?v=${videoId}`, "_blank");
    } else {
      toast.error("No YouTube video ID available");
    }
  }, []);

  const handleToggleStatus = useCallback(async (videoId, currentStatus, reason) => {
    try {
      await handleStatusChangeEnhanced(
        videoId,
        currentStatus === "active" ? false : true,
        reason
      );
    } catch (error) {
      // Error handling is done in the hook
    }
  }, [handleStatusChangeEnhanced]);

  const handleBulkAction = useCallback(async (action, itemIds, reason) => {
    try {
      await handleBulkActionEnhanced(action, itemIds, reason);
      handleClearSelection();
    } catch (error) {
      // Error handling is done in the hook
    }
  }, [handleBulkActionEnhanced, handleClearSelection]);

  // Memoized video delete handler
  const handleVideoDelete = useCallback(async (id, reason) => {
    console.log(`🗑️ Delete button clicked for video ${id} with reason: ${reason}`);
    try {
      const result = await videosService.deleteVideoEnhanced(id, reason);
      console.log('✅ Delete result:', result);
      await refetch();
      return result;
    } catch (error) {
      console.error('❌ Delete failed:', error);
      throw error;
    }
  }, [refetch]);

  // Memoized table columns configuration
  const columns = useMemo(() => [
    {
      key: "select",
      title: "",
      width: "50px",
      render: (value, video) => (
        <input
          type="checkbox"
          checked={selectedItems.includes(video.id)}
          onChange={(e) => handleSelectionChange(video.id, e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      ),
    },
    {
      key: "title",
      title: "Video",
      sortable: true,
      render: (value, video) => (
        <VideoTitleCell video={video} onView={handleViewVideo} />
      ),
    },
    {
      key: "category",
      title: "Category",
      sortable: true,
      render: (value) => (
        <CategoryBadge category={value} />
      ),
    },
    {
      key: "difficulty",
      title: "Difficulty",
      sortable: true,
      render: (value, video) => (
        <DifficultyBadge difficulty={value || video.difficulty_level} />
      ),
    },
    {
      key: "viewCount",
      title: "Views",
      sortable: true,
      render: (value) => (
        <ViewsDisplay count={value} />
      ),
    },
    {
      key: "courseOrder",
      title: "Order",
      sortable: true,
      render: (value, video) => video.courseOrder || video.course_order || "—",
    },
    {
      key: "createdAt",
      title: "Created",
      sortable: true,
      render: (value, video) =>
        dateHelpers.formatDate(value || video.created_at),
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      render: (value, video) => (
        <EnhancedStatusToggle
          item={video}
          currentStatus={value === "active" || value === true ? "active" : "inactive"}
          onStatusChange={handleToggleStatus}
          entityType="video"
          requiresReason={true}
          size="sm"
        />
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (value, video) => (
        <VideoActionsCell
          video={video}
          onView={handleView}
          onEdit={handleEdit}
          onPlay={handleViewVideo}
          onDelete={handleVideoDelete}
          userPermissions={userPermissions}
        />
      ),
    },
  ], [
    selectedItems,
    handleSelectionChange,
    handleViewVideo,
    handleToggleStatus,
    handleView,
    handleEdit,
    handleVideoDelete,
    userPermissions
  ]);

  // Memoized quick actions
  const quickActions = useMemo(() => {
    if (!userPermissions.isAdmin) return [];

    return [
      {
        label: "Add Video",
        icon: PlusIcon,
        onClick: handleCreate,
        className: "btn-primary",
      },
      {
        label: "YouTube Import",
        icon: CloudArrowUpIcon,
        onClick: handleYouTubeSearch,
        className: "btn-outline",
      },
    ];
  }, [userPermissions.isAdmin, handleCreate, handleYouTubeSearch]);

  // Memoized bulk actions configuration
  const bulkActions = useMemo(() => [
    {
      id: "activate",
      label: "Activate",
      handler: async (videoIds, reason) => {
        await handleBulkAction("activate", videoIds, reason);
      },
      requiresConfirmation: true,
      confirmTitle: "Activate Videos",
      confirmMessage: `Are you sure you want to activate ${selectedItems.length} selected videos?`,
      variant: "success",
    },
    {
      id: "deactivate",
      label: "Deactivate",
      handler: async (videoIds, reason) => {
        await handleBulkAction("deactivate", videoIds, reason);
      },
      requiresConfirmation: true,
      confirmTitle: "Deactivate Videos",
      confirmMessage: `Are you sure you want to deactivate ${selectedItems.length} selected videos?`,
      variant: "warning",
    },
    {
      id: "delete",
      label: "Delete",
      handler: async (videoIds, reason) => {
        await handleBulkAction("delete", videoIds, reason);
      },
      requiresConfirmation: true,
      confirmTitle: "Delete Videos",
      confirmMessage: `Are you sure you want to delete ${selectedItems.length} selected videos?`,
      variant: "danger",
    },
  ], [handleBulkAction, selectedItems.length]);

  // Memoized data processing
  const { displayData, pagination } = useMemo(() => {
    let data = [];
    let paginationInfo = {
      currentPage: 1,
      totalPages: 1,
      pageSize: 20,
      totalItems: 0,
    };

    if (videosResponse?.data && Array.isArray(videosResponse.data)) {
      data = videosResponse.data;
      const backendPagination = videosResponse.pagination || {};
      paginationInfo = {
        currentPage: backendPagination.currentPage || backendPagination.page || 1,
        totalPages: backendPagination.totalPages || backendPagination.pages || 1,
        totalItems: backendPagination.totalItems || backendPagination.total || 0,
        pageSize: backendPagination.pageSize || backendPagination.limit || 20,
      };
    } else if (videosResponse && Array.isArray(videosResponse)) {
      data = videosResponse;
    }

    return { displayData: data, pagination: paginationInfo };
  }, [videosResponse]);

  // Memoized selection state
  const selectionState = useMemo(() => {
    const isAllSelected = displayData.length > 0 && selectedItems.length === displayData.length;
    const isIndeterminate = selectedItems.length > 0 && selectedItems.length < displayData.length;
    return { isAllSelected, isIndeterminate };
  }, [displayData.length, selectedItems.length]);

  // Error boundary for the component
  if (error && !isLoading) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      {/* Debug Info (development only) */}
      {process.env.NODE_ENV === "development" && (
        <DebugInfo
          isLoading={isLoading}
          error={error}
          dataCount={displayData.length}
          selectedCount={selectedItems.length}
          crudLoading={crudLoading}
          showEnhancedDelete={showEnhancedDelete}
        />
      )}

      {/* Page Header */}
      <PageHeader 
        onCreateVideo={handleCreate}
        onYouTubeSearch={handleYouTubeSearch}
        userPermissions={userPermissions}
      />

      {/* Stats Cards */}
      <VideoStatsCards stats={videoStats} userPermissions={userPermissions} />

      {/* Filters Section */}
      <FiltersSection
        searchTerm={searchTerm}
        filters={filters}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        selectedItems={selectedItems}
        onClearSelection={handleClearSelection}
        bulkActions={bulkActions}
        crudLoading={crudLoading}
      />

      {/* Videos Table */}
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
        onSelectAll={(isSelected) => handleSelectAll(displayData, isSelected)}
        isAllSelected={selectionState.isAllSelected}
        isIndeterminate={selectionState.isIndeterminate}
      />

      {/* Modals */}
      <CrudModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        title={
          modalMode === "create"
            ? config.createTitle
            : modalMode === "edit"
            ? config.editTitle
            : config.viewTitle
        }
        mode={modalMode}
        initialData={selectedItem}
        fields={fieldConfig}
        loading={crudLoading}
        size="xl"
      />

      {showEnhancedDelete && deleteTarget && (
        <EnhancedConfirmModal
          isOpen={showEnhancedDelete}
          onClose={handleCloseModal}
          onConfirm={handleConfirmEnhancedDelete}
          title={`Delete ${deleteTarget?.title || 'Video'}`}
          message={`Are you sure you want to delete "${deleteTarget?.title}"? This will permanently remove the video.`}
          type="danger"
          items={deleteTarget ? [deleteTarget] : []}
          cascadingEffects={cascadingEffects}
          requiresReason={true}
          showImpactAnalysis={cascadingEffects.length > 0}
          confirmText="Delete Video"
          loading={crudLoading}
        />
      )}

      <YouTubeSearchModal
        isOpen={showYouTubeModal}
        onClose={() => setShowYouTubeModal(false)}
        onImport={handleYouTubeImport}
        loading={crudLoading}
      />
    </div>
  );
});

Videos.displayName = 'Videos';

// Optimized sub-components with memoization

const VideoTitleCell = memo(({ video, onView }) => (
  <div className="flex items-center">
    <div
      className="h-16 w-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden cursor-pointer relative group"
      onClick={() => onView(video)}
    >
      {video.thumbnailUrl || video.thumbnail_url ? (
        <img
          src={video.thumbnailUrl || video.thumbnail_url}
          alt={video.title}
          className="h-full w-full object-cover group-hover:opacity-80 transition-opacity"
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
          <PlayIcon className="h-8 w-8 text-gray-400" />
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-30 rounded-lg">
        <PlayIcon className="h-6 w-6 text-white drop-shadow-lg" />
      </div>
    </div>
    <div className="ml-4 flex-1 min-w-0">
      <div className="text-sm font-medium text-gray-900 truncate">
        {video.title}
      </div>
      <div className="text-sm text-gray-500 truncate">
        {video.description}
      </div>
      <div className="flex items-center space-x-4 mt-1">
        <span className="text-xs text-gray-400">
          Duration:{" "}
          {video.duration
            ? numberHelpers.formatDuration(video.duration)
            : "N/A"}
        </span>
        {video.viewCount > 0 && (
          <span className="text-xs text-gray-400 flex items-center">
            <EyeIcon className="h-3 w-3 mr-1" />
            {numberHelpers.formatNumber(video.viewCount)}
          </span>
        )}
      </div>
    </div>
  </div>
));

VideoTitleCell.displayName = 'VideoTitleCell';

const CategoryBadge = memo(({ category }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
    {VIDEO_CATEGORY_LABELS[category] ||
      stringHelpers.toTitleCase(category) ||
      "Uncategorized"}
  </span>
));

CategoryBadge.displayName = 'CategoryBadge';

const DifficultyBadge = memo(({ difficulty }) => {
  const colors = useMemo(() => ({
    beginner: "bg-green-100 text-green-800",
    elementary: "bg-blue-100 text-blue-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-orange-100 text-orange-800",
    expert: "bg-red-100 text-red-800",
  }), []);

  return (
    <span
      className={classNames(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        colors[difficulty] || "bg-gray-100 text-gray-800"
      )}
    >
      {DIFFICULTY_LABELS[difficulty] ||
        stringHelpers.toTitleCase(difficulty) ||
        "Not Set"}
    </span>
  );
});

DifficultyBadge.displayName = 'DifficultyBadge';

const ViewsDisplay = memo(({ count }) => (
  <span className="flex items-center text-sm text-gray-900">
    <EyeIcon className="h-4 w-4 mr-1 text-gray-400" />
    {numberHelpers.formatNumber(count || 0)}
  </span>
));

ViewsDisplay.displayName = 'ViewsDisplay';

const VideoActionsCell = memo(({ 
  video, 
  onView, 
  onEdit, 
  onPlay, 
  onDelete, 
  userPermissions 
}) => (
  <div className="flex items-center space-x-2">
    <button
      onClick={() => onPlay(video)}
      className="p-1 rounded text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
      title="Play video"
    >
      <PlayIcon className="h-4 w-4" />
    </button>
    <button
      onClick={() => onView(video)}
      className="p-1 rounded text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
      title="View details"
    >
      <EyeIcon className="h-4 w-4" />
    </button>
    {userPermissions.isAdmin && (
      <>
        <button
          onClick={() => onEdit(video)}
          className="p-1 rounded text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
          title="Edit video"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
        <EnhancedDeleteButton
          item={video}
          onDelete={onDelete}
          entityType="video"
          cascadingEffects={[
            "Video removed from all playlists",
            "Student progress data archived",
            "View statistics preserved",
          ]}
        />
      </>
    )}
  </div>
));

VideoActionsCell.displayName = 'VideoActionsCell';

const PageHeader = memo(({ onCreateVideo, onYouTubeSearch, userPermissions }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 flex items-center">
        <VideoCameraIcon className="h-8 w-8 mr-3 text-blue-600" />
        Video Management
      </h1>
      <p className="mt-2 text-gray-600">
        Manage educational videos and learning content
      </p>
    </div>

    <PermissionGate permission="videos">
      <div className="mt-4 sm:mt-0 flex space-x-3">
        {userPermissions.isAdmin && (
          <>
            <button
              onClick={onYouTubeSearch}
              className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded-md hover:bg-green-200 transition-colors"
            >
              <MagnifyingGlassIcon className="h-5 w-5 mr-2 inline" />
              YouTube Import
            </button>
            <button
              onClick={onCreateVideo}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2 inline" />
              Add Video
            </button>
          </>
        )}
      </div>
    </PermissionGate>
  </div>
));

PageHeader.displayName = 'PageHeader';

const FiltersSection = memo(({
  searchTerm,
  filters,
  onSearch,
  onFilterChange,
  selectedItems,
  onClearSelection,
  bulkActions,
  crudLoading
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
      {/* Search */}
      <div className="flex-1 max-w-lg">
        <SearchInput
          placeholder="Search videos by title, description, or category..."
          value={searchTerm}
          onChange={(term) => onSearch(term)}
          onSearch={onSearch}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <select
          value={filters.category}
          onChange={(e) => onFilterChange("category", e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="">All Categories</option>
          {Object.entries(VIDEO_CATEGORIES).map(([key, value]) => (
            <option key={key} value={value}>
              {VIDEO_CATEGORY_LABELS[value] ||
                stringHelpers.toTitleCase(value)}
            </option>
          ))}
        </select>

        <select
          value={filters.difficulty_level}
          onChange={(e) =>
            onFilterChange("difficulty_level", e.target.value)
          }
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="">All Difficulties</option>
          {Object.entries(DIFFICULTY_LEVELS).map(([key, value]) => (
            <option key={key} value={value}>
              {DIFFICULTY_LABELS[value] || stringHelpers.toTitleCase(value)}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>

    {/* Bulk Actions Bar */}
    <BulkActions
      selectedItems={selectedItems}
      onClearSelection={onClearSelection}
      actions={bulkActions}
      itemName="videos"
      loading={crudLoading}
    />
  </div>
));

FiltersSection.displayName = 'FiltersSection';

const DebugInfo = memo(({
  isLoading,
  error,
  dataCount,
  selectedCount,
  crudLoading,
  showEnhancedDelete
}) => (
  <div className="bg-purple-50 border border-purple-200 rounded p-4 text-sm">
    <strong>Videos Debug Info:</strong>
    <div>Loading: {isLoading ? "Yes" : "No"}</div>
    <div>Error: {error ? error.message : "None"}</div>
    <div>Videos Count: {dataCount}</div>
    <div>Selected: {selectedCount}</div>
    <div>CRUD Loading: {crudLoading ? "Yes" : "No"}</div>
    <div>Enhanced Delete Modal: {showEnhancedDelete ? "Open" : "Closed"}</div>
  </div>
));

DebugInfo.displayName = 'DebugInfo';

const ErrorState = memo(({ error, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
    <div className="text-center">
      <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400 mb-4" />
      <h3 className="text-lg font-medium text-red-900 mb-2">Failed to Load Videos</h3>
      <p className="text-red-700 mb-4">
        Error: {error?.message || 'Unknown error occurred'}
      </p>
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Retry Loading
      </button>
    </div>
  </div>
));

ErrorState.displayName = 'ErrorState';

// Video Statistics Cards Component - Optimized
const VideoStatsCards = memo(({ stats, userPermissions }) => {
  const displayStats = useMemo(() => {
    if (!stats) return null;

    return [
      {
        name: "Total Videos",
        value:
          stats.totalVideos?.toString() || stats.total_videos?.toString() || "0",
        icon: VideoCameraIcon,
        color: "blue",
      },
      {
        name: "Active Videos",
        value:
          stats.activeVideos?.toString() ||
          stats.active_videos?.toString() ||
          "0",
        icon: ChartBarIcon,
        color: "green",
      },
      {
        name: "Total Views",
        value: stats.totalViews
          ? numberHelpers.formatNumber(stats.totalViews)
          : stats.total_views
          ? numberHelpers.formatNumber(stats.total_views)
          : "0",
        icon: EyeIcon,
        color: "yellow",
      },
      {
        name: "Categories",
        value:
          stats.categoriesCount?.toString() ||
          (stats.byCategory
            ? Object.keys(stats.byCategory).length.toString()
            : "0"),
        icon: FireIcon,
        color: "purple",
      },
    ];
  }, [stats]);

  if (!userPermissions.isAdmin) {
    return <NonAdminView />;
  }

  if (!displayStats) {
    return <StatsLoadingSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {displayStats.map((stat) => (
        <StatCard key={stat.name} stat={stat} />
      ))}
    </div>
  );
});
VideoStatsCards.displayName = 'VideoStatsCards';

const NonAdminView = memo(() => (
 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
   <div className="text-center text-gray-500">
     <VideoCameraIcon className="h-12 w-12 mx-auto mb-4 text-blue-400" />
     <p className="text-lg font-medium text-gray-900">
       Educational Videos
     </p>
     <p className="text-sm">
       Explore our collection of learning videos below.
     </p>
   </div>
 </div>
));

NonAdminView.displayName = 'NonAdminView';

const StatsLoadingSkeleton = memo(() => (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
   {Array.from({ length: 4 }).map((_, index) => (
     <div
       key={index}
       className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
     >
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
));

StatsLoadingSkeleton.displayName = 'StatsLoadingSkeleton';

const StatCard = memo(({ stat }) => (
 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
   <div className="flex items-center">
     {stat.icon && (
       <div
         className={classNames(
           "flex-shrink-0 p-3 rounded-lg",
           stat.color === "blue" && "bg-blue-500 text-white",
           stat.color === "green" && "bg-green-500 text-white",
           stat.color === "yellow" && "bg-yellow-500 text-white",
           stat.color === "purple" && "bg-purple-500 text-white"
         )}
       >
         <stat.icon className="h-6 w-6" />
       </div>
     )}
     <div className={classNames("flex-1", stat.icon ? "ml-4" : "")}>
       <p className="text-sm font-medium text-gray-600">{stat.name}</p>
       <div className="flex items-baseline">
         <p className="text-2xl font-semibold text-gray-900">
           {stat.value}
         </p>
       </div>
     </div>
   </div>
 </div>
));

StatCard.displayName = 'StatCard';

export default Videos;
