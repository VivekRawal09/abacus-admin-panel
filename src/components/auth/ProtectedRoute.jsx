import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  requiredPermission = null,
  fallbackPath = '/login',
  showUnauthorized = true 
}) => {
  const { isAuthenticated, isLoading, user, hasRole, canAccess } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" text="Checking authentication..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    if (showUnauthorized) {
      return <UnauthorizedAccess />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // Check permission-based access
  if (requiredPermission && !canAccess(requiredPermission)) {
    if (showUnauthorized) {
      return <UnauthorizedAccess />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and authorized
  return children;
};

// Unauthorized access component
const UnauthorizedAccess = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-danger-100 p-3">
            <svg
              className="h-12 w-12 text-danger-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Access Denied
        </h1>
        
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>

        <div className="space-y-3">
          <div className="text-sm text-gray-500">
            <p>Logged in as: <span className="font-medium">{user?.email}</span></p>
            <p>Role: <span className="font-medium capitalize">{user?.role?.replace('_', ' ')}</span></p>
          </div>
          
          <button
            onClick={() => window.history.back()}
            className="btn btn-primary w-full"
          >
            Go Back
          </button>
          
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="btn btn-outline w-full"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

// HOC for protecting individual components
export const withAuth = (Component, options = {}) => {
  const AuthenticatedComponent = (props) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );

  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  
  return AuthenticatedComponent;
};

// Hook for checking permissions in components
export const usePermissions = () => {
  const { user, hasRole, canAccess } = useAuth();

  const checkPermission = (permission) => canAccess(permission);
  const checkRole = (role) => hasRole(role);
  
  const isSuperAdmin = () => hasRole('super_admin');
  const isZoneManager = () => hasRole('zone_manager');
  const isInstituteAdmin = () => hasRole('institute_admin');
  const isTeacher = () => hasRole('teacher');
  const isStudent = () => hasRole('student');
  const isParent = () => hasRole('parent');

  const canManageUsers = () => canAccess('users');
  const canManageVideos = () => canAccess('videos');
  const canManageInstitutes = () => canAccess('institutes');
  const canViewAnalytics = () => canAccess('analytics');
  const canManageSettings = () => canAccess('settings');

  return {
    user,
    checkPermission,
    checkRole,
    isSuperAdmin,
    isZoneManager,
    isInstituteAdmin,
    isTeacher,
    isStudent,
    isParent,
    canManageUsers,
    canManageVideos,
    canManageInstitutes,
    canViewAnalytics,
    canManageSettings,
  };
};

// Component for conditionally rendering based on permissions
export const PermissionGate = ({ 
  children, 
  permission = null, 
  role = null, 
  fallback = null,
  requireAll = false // if true, requires all permissions/roles
}) => {
  const { hasRole, canAccess } = useAuth();

  const hasRequiredPermissions = () => {
    const permissions = Array.isArray(permission) ? permission : [permission].filter(Boolean);
    const roles = Array.isArray(role) ? role : [role].filter(Boolean);

    const permissionChecks = permissions.map(p => canAccess(p));
    const roleChecks = roles.map(r => hasRole(r));

    const allChecks = [...permissionChecks, ...roleChecks];

    if (allChecks.length === 0) return true; // No restrictions

    return requireAll 
      ? allChecks.every(check => check)
      : allChecks.some(check => check);
  };

  if (hasRequiredPermissions()) {
    return children;
  }

  return fallback;
};

// Admin-only wrapper component
export const AdminOnly = ({ children, fallback = null }) => (
  <PermissionGate 
    role={['super_admin', 'zone_manager', 'institute_admin']} 
    fallback={fallback}
  >
    {children}
  </PermissionGate>
);

// Super admin only wrapper component
export const SuperAdminOnly = ({ children, fallback = null }) => (
  <PermissionGate role="super_admin" fallback={fallback}>
    {children}
  </PermissionGate>
);

// Role-specific components
export const RoleSpecific = ({ roles, children, fallback = null }) => (
  <PermissionGate role={roles} fallback={fallback}>
    {children}
  </PermissionGate>
);

export default ProtectedRoute;