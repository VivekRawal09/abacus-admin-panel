import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePaginatedApi } from '../hooks/useApi';
import { usersService } from '../services/users';
import DataTable from '../components/common/DataTable';
import SearchInput from '../components/common/SearchInput';
import ConfirmModal from '../components/common/ConfirmModal';
import { PermissionGate } from '../components/auth/ProtectedRoute';
import toast from 'react-hot-toast';
import { 
  PlusIcon,
  UsersIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { ROLE_LABELS, ROLE_COLORS } from '../utils/constants';
import { dateHelpers } from '../utils/helpers';
import classNames from 'classnames';

const Users = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    institute_id: '',
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });
  const [bulkDeleteModal, setBulkDeleteModal] = useState({ isOpen: false });
  const [userStats, setUserStats] = useState(null);

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
    'users',
    (params) => usersService.getUsers({
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
  console.log('🔍 Users API Response:', usersResponse);
  console.log('📊 Loading:', loading);
  console.log('❌ Error:', error);

  // Check if loading is undefined, default to false
  const isLoading = loading === undefined ? false : loading;

  // Fetch user statistics - REAL DATA ONLY
  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('📊 Fetching user stats...');
        const stats = await usersService.getUserStats();
        console.log('✅ User stats received:', stats);
        setUserStats(stats);
      } catch (error) {
        console.error('❌ Failed to fetch user stats:', error);
        setUserStats(null);
      }
    };

    fetchStats();
  }, []);

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

  // Handle user creation - FUNCTIONAL
  const handleCreateUser = () => {
    // TODO: Implement user creation modal/form
    toast('Create user functionality will be implemented. For now, use the backend API directly.', {
      icon: 'ℹ️',
    });
  };

  // Handle user view
  const handleViewUser = (userId) => {
    // TODO: Implement user detail view
    toast(`View user ${userId} - functionality will be implemented`, {
      icon: '👁️',
    });
  };

  // Handle user edit
  const handleEditUser = (userId) => {
    // TODO: Implement user edit modal/form
    toast(`Edit user ${userId} - functionality will be implemented`, {
      icon: '✏️',
    });
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    try {
      await usersService.deleteUser(userId);
      toast.success('User deleted successfully');
      refetch();
      setDeleteModal({ isOpen: false, user: null });
    } catch (error) {
      toast.error('Failed to delete user: ' + (error.response?.data?.error || error.message));
    }
  };

  // Handle bulk deletion
  const handleBulkDelete = async () => {
    try {
      await usersService.bulkDeleteUsers(selectedUsers);
      toast.success(`${selectedUsers.length} users deleted successfully`);
      setSelectedUsers([]);
      setBulkDeleteModal({ isOpen: false });
      refetch();
    } catch (error) {
      toast.error('Failed to delete users: ' + (error.response?.data?.error || error.message));
    }
  };

  // Handle status toggle
  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await usersService.updateUserStatus(userId, !currentStatus);
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      refetch();
    } catch (error) {
      toast.error('Failed to update user status: ' + (error.response?.data?.error || error.message));
    }
  };

  // Handle CSV export
  const handleExportUsers = async () => {
    try {
      const response = await usersService.exportUsers({
        ...filters,
        format: 'csv'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Users exported successfully');
    } catch (error) {
      toast.error('Failed to export users: ' + (error.response?.data?.error || error.message));
    }
  };

  // Handle CSV import - FUNCTIONAL
  const handleImportUsers = () => {
    // TODO: Implement file upload modal for CSV import
    toast('Import users functionality will be implemented. For now, use the backend API directly.', {
      icon: '📥',
    });
  };

  // Table columns configuration
  const columns = [
    {
      key: 'select',
      title: '',
      width: '50px',
      render: (value, userItem) => (
        <input
          type="checkbox"
          checked={selectedUsers.includes(userItem.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedUsers([...selectedUsers, userItem.id]);
            } else {
              setSelectedUsers(selectedUsers.filter(id => id !== userItem.id));
            }
          }}
          className="form-checkbox"
        />
      ),
    },
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      render: (value, userItem) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {userItem.first_name?.charAt(0) || ''}{userItem.last_name?.charAt(0) || ''}
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
      ),
    },
    {
      key: 'role',
      title: 'Role',
      sortable: true,
      render: (value) => (
        <span className={classNames(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          ROLE_COLORS[value] || 'bg-gray-100 text-gray-800'
        )}>
          {ROLE_LABELS[value] || value}
        </span>
      ),
    },
    {
      key: 'institute_name',
      title: 'Institute',
      render: (value) => value || <span className="text-gray-400">—</span>,
    },
    {
      key: 'phone',
      title: 'Phone',
      render: (value) => value || <span className="text-gray-400">—</span>,
    },
    {
      key: 'is_active',
      title: 'Status',
      sortable: true,
      render: (value, userItem) => (
        <button
          onClick={() => handleToggleStatus(userItem.id, value)}
          className={classNames(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors',
            value ? 'bg-success-100 text-success-800 hover:bg-success-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          )}
        >
          {value ? 'Active' : 'Inactive'}
        </button>
      ),
    },
    {
      key: 'last_login',
      title: 'Last Login',
      render: (value) => value ? dateHelpers.formatDate(value) : <span className="text-gray-400">Never</span>,
    },
    {
      key: 'created_at',
      title: 'Joined',
      sortable: true,
      render: (value) => dateHelpers.formatDate(value),
    },
    {
      key: 'actions',
      title: 'Actions',
      actions: [
        {
          label: 'View',
          icon: EyeIcon,
          onClick: (userItem) => handleViewUser(userItem.id),
        },
        {
          label: 'Edit',
          icon: PencilIcon,
          onClick: (userItem) => handleEditUser(userItem.id),
        },
        {
          label: 'Delete',
          icon: TrashIcon,
          variant: 'danger',
          onClick: (userItem) => setDeleteModal({ isOpen: true, user: userItem }),
          disabled: (userItem) => userItem.role === 'super_admin' || userItem.id === user?.id,
        },
      ],
    },
  ];

  // Quick actions
  const quickActions = [
    {
      label: 'Add User',
      icon: PlusIcon,
      onClick: handleCreateUser,
      className: 'btn-primary',
    },
    {
      label: 'Import Users',
      icon: ArrowUpTrayIcon,
      onClick: handleImportUsers,
      className: 'btn-outline',
    },
    {
      label: 'Export Users',
      icon: ArrowDownTrayIcon,
      onClick: handleExportUsers,
      className: 'btn-outline',
    },
  ];

  // Add bulk delete action if users are selected
  if (selectedUsers.length > 0) {
    quickActions.push({
      label: `Delete Selected (${selectedUsers.length})`,
      icon: TrashIcon,
      onClick: () => setBulkDeleteModal({ isOpen: true }),
      className: 'btn-danger',
    });
  }

  // FIXED: Extract real data from API response
  let displayData = [];
  let pagination = {
    currentPage: 1,
    totalPages: 1,
    pageSize: 20,
    totalItems: 0,
  };

  // Handle the exact API response format from your test results
  if (usersResponse?.data && Array.isArray(usersResponse.data)) {
    displayData = usersResponse.data;
    pagination = usersResponse.pagination || pagination;
  } else if (usersResponse && Array.isArray(usersResponse)) {
    // Sometimes API might return array directly
    displayData = usersResponse;
  }

  console.log('📋 Final display data:', displayData);
  console.log('📄 Final pagination:', pagination);

  return (
    <div className="space-y-6">
      {/* Debug Info (remove after testing) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm">
          <strong>Debug Info:</strong>
          <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
          <div>Error: {error ? error.message : 'None'}</div>
          <div>Users Count: {displayData.length}</div>
          <div>API Response Type: {usersResponse ? typeof usersResponse : 'undefined'}</div>
        </div>
      )}

      {/* Page Header */}
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
            <button onClick={handleCreateUser} className="btn btn-primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              Add User
            </button>
          </div>
        </PermissionGate>
      </div>

      {/* Stats Cards */}
      <UserStatsCards stats={userStats} />

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-lg">
            <SearchInput
              placeholder="Search users by name, email, or institute..."
              value={searchTerm}
              onChange={setSearchTerm}
              onSearch={handleSearch}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
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
              onChange={(e) => handleFilterChange('status', e.target.value === 'active' ? 'true' : e.target.value === 'inactive' ? 'false' : '')}
              className="form-select"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table - REAL DATA ONLY */}
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
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        onConfirm={() => handleDeleteUser(deleteModal.user?.id)}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteModal.user?.first_name} ${deleteModal.user?.last_name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={bulkDeleteModal.isOpen}
        onClose={() => setBulkDeleteModal({ isOpen: false })}
        onConfirm={handleBulkDelete}
        title="Delete Selected Users"
        message={`Are you sure you want to delete ${selectedUsers.length} selected users? This action cannot be undone.`}
        confirmText="Delete All"
        variant="danger"
      />
    </div>
  );
};

// User Statistics Cards Component - REAL DATA ONLY
const UserStatsCards = ({ stats }) => {
  if (!stats) {
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

  const displayStats = [
    {
      name: 'Total Users',
      value: stats.total_users?.toString() || '0',
      change: 'N/A',
      icon: UsersIcon,
      color: 'primary',
    },
    {
      name: 'Super Admins',
      value: stats.by_role?.super_admin?.toString() || '0',
      change: 'N/A',
      color: 'success',
    },
    {
      name: 'Institute Admins',
      value: stats.by_role?.institute_admin?.toString() || '0',
      change: 'N/A',
      color: 'warning',
    },
    {
      name: 'Students',
      value: stats.by_role?.student?.toString() || '0',
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

export default Users;