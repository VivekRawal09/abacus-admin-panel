import React, { useState, useEffect, memo, useMemo, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { usePaginatedApi } from "../hooks/useApi";
import { usersService } from "../services/users";
import { useCrud } from "../hooks/useCrud";
import DataTable from "../components/common/DataTable";
import SearchInput from "../components/common/SearchInput";
import CrudModal from "../components/common/CrudModal";
import BulkActions from "../components/common/BulkActions";
import ImportUsersModal from "../components/common/ImportUsersModal";
import { PermissionGate } from "../components/auth/ProtectedRoute";
import toast from "react-hot-toast";
import EnhancedConfirmModal from "../components/common/EnhancedConfirmModal";
import EnhancedStatusToggle from "../components/common/EnhancedStatusToggle";
import EnhancedDeleteButton from "../components/common/EnhancedDeleteButton";
import {
  PlusIcon,
  UsersIcon,
  PencilIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { ROLE_LABELS, ROLE_COLORS } from "../utils/constants";
import { dateHelpers } from "../utils/helpers";
import classNames from "classnames";

// Main Users component with performance optimizations
const Users = memo(() => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    role: "",
    status: "",
    institute_id: "",
  });
  const [userStats, setUserStats] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);

  // Memoized API parameters to prevent unnecessary re-renders
  const apiParams = useMemo(() => ({
    search: searchTerm,
    ...filters,
  }), [searchTerm, filters]);

  // Fetch users with pagination - REAL DATA ONLY
  const {
    data: usersResponse,
    loading,
    error,
    refetch,
    params,
    updateParams,
    goToPage,
    changePageSize,
  } = usePaginatedApi(
    "users",
    useCallback((params) => usersService.getUsers({ ...params, ...apiParams }), [apiParams]),
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
  } = useCrud("user", usersService, refetch);

  const isLoading = loading === undefined ? false : loading;

  // Memoized user statistics fetch
  const fetchStats = useCallback(async () => {
    try {
      console.log("📊 Fetching user stats...");
      const stats = await usersService.getUserStats();
      console.log("✅ User stats received:", stats);
      setUserStats(stats);
    } catch (error) {
      console.error("❌ Failed to fetch user stats:", error);
      setUserStats(null);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Memoized handlers to prevent unnecessary re-renders
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

  const handleToggleStatus = useCallback(async (userId, currentStatus, reason) => {
    try {
      await handleStatusChangeEnhanced(userId, !currentStatus, reason);
    } catch (error) {
      // Error handling is done in the hook
    }
  }, [handleStatusChangeEnhanced]);

  const handleExportUsers = useCallback(async () => {
    try {
      const response = await usersService.exportUsers({
        ...filters,
        format: "csv",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `users-${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Users exported successfully");
    } catch (error) {
      toast.error(
        "Failed to export users: " +
          (error.response?.data?.error || error.message)
      );
    }
  }, [filters]);

  const handleImportUsers = useCallback(() => {
    setShowImportModal(true);
  }, []);

  const handleImportSubmit = useCallback(async (file, options) => {
    try {
      const result = await usersService.importUsers(file, options);

      if (result.success) {
        toast.success(
          `Successfully imported ${result.imported || 0} users. ${
            result.skipped || 0
          } skipped.`
        );
        refetch();
      } else {
        toast.error("Import failed: " + (result.error || "Unknown error"));
      }

      setShowImportModal(false);
    } catch (error) {
      console.error("Import error:", error);
      toast.error(
        "Import failed: " + (error.response?.data?.error || error.message)
      );
      throw error;
    }
  }, [refetch]);

  const handleBulkAction = useCallback(async (action, itemIds, reason) => {
    try {
      await handleBulkActionEnhanced(action, itemIds, reason);
      handleClearSelection();
    } catch (error) {
      // Error handling is done in the hook
    }
  }, [handleBulkActionEnhanced, handleClearSelection]);

  // Memoized table columns configuration
  const columns = useMemo(() => [
    {
      key: "select",
      title: "",
      width: "50px",
      render: (value, userItem) => (
        <input
          type="checkbox"
          checked={selectedItems.includes(userItem.id)}
          onChange={(e) => handleSelectionChange(userItem.id, e.target.checked)}
          className="form-checkbox"
        />
      ),
    },
    {
      key: "name",
      title: "Name",
      sortable: true,
      render: (value, userItem) => (
        <UserNameCell userItem={userItem} />
      ),
    },
    {
      key: "role",
      title: "Role",
      sortable: true,
      render: (value) => (
        <RoleBadge role={value} />
      ),
    },
    {
      key: "institute_name",
      title: "Institute",
      render: (value) => value || <span className="text-gray-400">—</span>,
    },
    {
      key: "phone",
      title: "Phone",
      render: (value) => value || <span className="text-gray-400">—</span>,
    },
    {
      key: "is_active",
      title: "Status",
      sortable: true,
      render: (value, userItem) => (
        <EnhancedStatusToggle
          item={userItem}
          currentStatus={value ? "active" : "inactive"}
          onStatusChange={handleToggleStatus}
          entityType="user"
          requiresReason={true}
          size="sm"
        />
      ),
    },
    {
      key: "last_login",
      title: "Last Login",
      render: (value) =>
        value ? (
          dateHelpers.formatDate(value)
        ) : (
          <span className="text-gray-400">Never</span>
        ),
    },
    {
      key: "created_at",
      title: "Joined",
      sortable: true,
      render: (value) => dateHelpers.formatDate(value),
    },
    {
      key: "actions",
      title: "Actions",
      render: (value, userItem) => (
        <UserActionsCell
          userItem={userItem}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={async (id, reason) => {
            console.log(`🗑️ Delete button clicked for user ${id} with reason: ${reason}`);
            try {
              const result = await usersService.deleteUserEnhanced(id, reason);
              console.log('✅ Delete result:', result);
              await refetch();
              return result;
            } catch (error) {
              console.error('❌ Delete failed:', error);
              throw error;
            }
          }}
          currentUser={user}
        />
      ),
    },
  ], [selectedItems, handleSelectionChange, handleToggleStatus, handleView, handleEdit, refetch, user]);

  // Memoized quick actions
  const quickActions = useMemo(() => [
    {
      label: "Add User",
      icon: PlusIcon,
      onClick: handleCreate,
      className: "btn-primary",
    },
    {
      label: "Import Users",
      icon: ArrowUpTrayIcon,
      onClick: handleImportUsers,
      className: "btn-outline",
    },
    {
      label: "Export Users",
      icon: ArrowDownTrayIcon,
      onClick: handleExportUsers,
      className: "btn-outline",
    },
  ], [handleCreate, handleImportUsers, handleExportUsers]);

  // Memoized bulk actions configuration
  const bulkActions = useMemo(() => [
    {
      id: "activate",
      label: "Activate",
      handler: async (userIds, reason) => {
        await handleBulkAction("activate", userIds, reason);
      },
      requiresConfirmation: true,
      confirmTitle: "Activate Users",
      confirmMessage: `Are you sure you want to activate ${selectedItems.length} selected users?`,
      variant: "success",
    },
    {
      id: "deactivate",
      label: "Deactivate",
      handler: async (userIds, reason) => {
        await handleBulkAction("deactivate", userIds, reason);
      },
      requiresConfirmation: true,
      confirmTitle: "Deactivate Users",
      confirmMessage: `Are you sure you want to deactivate ${selectedItems.length} selected users?`,
      variant: "warning",
    },
    {
      id: "delete",
      label: "Delete",
      handler: async (userIds, reason) => {
        await handleBulkAction("delete", userIds, reason);
      },
      requiresConfirmation: true,
      confirmTitle: "Delete Users",
      confirmMessage: `Are you sure you want to delete ${selectedItems.length} selected users?`,
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

    if (usersResponse?.data && Array.isArray(usersResponse.data)) {
      data = usersResponse.data;
      paginationInfo = usersResponse.pagination || paginationInfo;
    } else if (usersResponse && Array.isArray(usersResponse)) {
      data = usersResponse;
    }

    return { displayData: data, pagination: paginationInfo };
  }, [usersResponse]);

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
      <PageHeader onCreateUser={handleCreate} />

      {/* Stats Cards */}
      <UserStatsCards stats={userStats} />

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

      {/* Users Table */}
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
        searchPlaceholder="Search users..."
        emptyMessage="No users found. Try adjusting your search or filters."
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
          title={`Delete ${deleteTarget?.first_name} ${deleteTarget?.last_name}`}
          message={`Are you sure you want to delete "${deleteTarget?.first_name} ${deleteTarget?.last_name}"? This will permanently remove the user account.`}
          type="danger"
          items={deleteTarget ? [deleteTarget] : []}
          cascadingEffects={cascadingEffects}
          requiresReason={true}
          showImpactAnalysis={cascadingEffects.length > 0}
          confirmText="Delete User"
          loading={crudLoading}
        />
      )}

      <ImportUsersModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportSubmit}
        loading={crudLoading}
      />
    </div>
  );
});

Users.displayName = 'Users';

// Optimized sub-components with memoization

const UserNameCell = memo(({ userItem }) => (
  <div className="flex items-center">
    <div className="h-10 w-10 flex-shrink-0">
      <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
        <span className="text-sm font-medium text-white">
          {userItem.first_name?.charAt(0) || ""}
          {userItem.last_name?.charAt(0) || ""}
        </span>
      </div>
    </div>
    <div className="ml-4">
      <div className="text-sm font-medium text-gray-900">
        {userItem.first_name} {userItem.last_name}
      </div>
      <div className="text-sm text-gray-500">{userItem.email}</div>
    </div>
  </div>
));

UserNameCell.displayName = 'UserNameCell';

const RoleBadge = memo(({ role }) => (
  <span
    className={classNames(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      ROLE_COLORS[role] || "bg-gray-100 text-gray-800"
    )}
  >
    {ROLE_LABELS[role] || role}
  </span>
));

RoleBadge.displayName = 'RoleBadge';

const UserActionsCell = memo(({ userItem, onView, onEdit, onDelete, currentUser }) => (
  <div className="flex items-center space-x-2">
    <button
      onClick={() => onView(userItem)}
      className="p-1 rounded text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
      title="View user"
    >
      <EyeIcon className="h-4 w-4" />
    </button>
    <button
      onClick={() => onEdit(userItem)}
      className="p-1 rounded text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
      title="Edit user"
    >
      <PencilIcon className="h-4 w-4" />
    </button>
    <EnhancedDeleteButton
      item={userItem}
      onDelete={onDelete}
      entityType="user"
      disabled={
        userItem.role === "super_admin" || userItem.id === currentUser?.id
      }
      cascadingEffects={[
        "All user sessions will be terminated",
        "User progress data will be archived",
        "Associated reports will be marked as deleted",
      ]}
    />
  </div>
));

UserActionsCell.displayName = 'UserActionsCell';

const PageHeader = memo(({ onCreateUser }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 flex items-center">
        <UsersIcon className="h-8 w-8 mr-3 text-primary-600" />
        Users Management
      </h1>
      <p className="mt-2 text-gray-600">
        Manage users, roles, and permissions across your platform
      </p>
    </div>

    <PermissionGate permission="users">
      <div className="mt-4 sm:mt-0">
        <button onClick={onCreateUser} className="btn btn-primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add User
        </button>
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
          placeholder="Search users by name, email, or institute..."
          value={searchTerm}
          onChange={(term) => onSearch(term)}
          onSearch={onSearch}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <select
          value={filters.role}
          onChange={(e) => onFilterChange("role", e.target.value)}
          className="form-select"
        >
          <option value="">All Roles</option>
          <option value="student">Students</option>
          <option value="teacher">Teachers</option>
          <option value="institute_admin">Institute Admins</option>
          <option value="zone_manager">Zone Managers</option>
          <option value="super_admin">Super Admins</option>
          <option value="parent">Parents</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) =>
            onFilterChange(
              "status",
              e.target.value === "active"
                ? "true"
                : e.target.value === "inactive"
                ? "false"
                : ""
            )
          }
          className="form-select"
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
      itemName="users"
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
  <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm">
    <strong>Users Debug Info:</strong>
    <div>Loading: {isLoading ? "Yes" : "No"}</div>
    <div>Error: {error ? error.message : "None"}</div>
    <div>Users Count: {dataCount}</div>
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
      <h3 className="text-lg font-medium text-red-900 mb-2">Failed to Load Users</h3>
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

// User Statistics Cards Component - Optimized
const UserStatsCards = memo(({ stats }) => {
  const displayStats = useMemo(() => {
    if (!stats) return null;
    
    return [
      {
        name: "Total Users",
        value: stats.total_users?.toString() || "0",
        change: "N/A",
        icon: UsersIcon,
        color: "primary",
      },
      {
        name: "Super Admins",
        value: stats.by_role?.super_admin?.toString() || "0",
        change: "N/A",
        color: "success",
      },
      {
        name: "Institute Admins",
        value: stats.by_role?.institute_admin?.toString() || "0",
        change: "N/A",
        color: "warning",
      },
      {
        name: "Students",
        value: stats.by_role?.student?.toString() || "0",
        change: "N/A",
        color: "info",
      },
    ];
  }, [stats]);

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

UserStatsCards.displayName = 'UserStatsCards';

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
            stat.color === "primary" && "bg-primary-500 text-white",
            stat.color === "success" && "bg-success-500 text-white",
            stat.color === "warning" && "bg-warning-500 text-white",
            stat.color === "info" && "bg-info-500 text-white"
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

export default Users;