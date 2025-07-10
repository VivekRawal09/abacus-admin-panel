import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { authService } from "../services/auth";
import toast from "react-hot-toast";

const AuthContext = createContext();

/**
 * Optimized useAuth hook with error boundary
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * AuthProvider Component - Performance Optimized
 * CRITICAL: This affects every component in the app
 * Enhanced with useCallback, useMemo for maximum performance
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Memoized role-based landing page configuration
  const roleLandingPages = useMemo(() => ({
    parent: '/videos',
    student: '/videos',
    teacher: '/videos',
    institute_admin: '/dashboard',
    zone_manager: '/dashboard',
    super_admin: '/dashboard',
    default: '/dashboard'
  }), []);

  // Memoized permissions configuration
  const rolePermissions = useMemo(() => ({
    super_admin: [
      "users", 
      "videos", 
      "institutes", 
      "zones", 
      "analytics", 
      "settings", 
      "system"
    ],
    zone_manager: [
      "users", 
      "videos", 
      "institutes", 
      "analytics", 
      "reports"
    ],
    institute_admin: [
      "users", 
      "videos", 
      "analytics", 
      "reports"
    ],
    teacher: [
      "videos", 
      "students", 
      "analytics"
    ],
    student: [
      "videos", 
      "progress"
    ],
    parent: [
      "progress", 
      "videos",
      "reports"
    ],
  }), []);

  // Memoized admin roles for quick lookups
  const adminRoles = useMemo(() => 
    new Set(['super_admin', 'zone_manager', 'institute_admin'])
  , []);

  // Check if user is already logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Memoized helper function to get role-based landing page
  const getRoleLandingPage = useCallback((userRole) => {
    return roleLandingPages[userRole] || roleLandingPages.default;
  }, [roleLandingPages]);

  // Optimized auth status check with better error handling
  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Verify token with backend
      const userData = await authService.getProfile();
      if (userData?.user) {
        setUser(userData.user);
        setIsAuthenticated(true);
        
        // Update localStorage with fresh data
        localStorage.setItem("user_data", JSON.stringify(userData.user));
      } else {
        // Invalid response, clear auth data
        clearAuthData();
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      
      // If it's a 401 error, token is invalid/expired
      if (error.response?.status === 401) {
        clearAuthData();
      } else {
        // For other errors, don't show toast on initial load
        console.error("Authentication verification failed:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Memoized function to clear auth data
  const clearAuthData = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Optimized login function with better error handling
  const login = useCallback(async (email, password) => {
    try {
      setIsLoading(true);

      // Clear any existing auth data
      clearAuthData();

      // Call real API login
      const response = await authService.login(email, password);

      if (response?.success && response?.user && response?.token) {
        // Store token and user data
        localStorage.setItem("auth_token", response.token);
        localStorage.setItem("user_data", JSON.stringify(response.user));

        // Set user data in state
        setUser(response.user);
        setIsAuthenticated(true);

        // Get role-based redirect
        const landingPage = getRoleLandingPage(response.user.role);
        
        return { 
          success: true,
          redirectTo: landingPage
        };
      } else {
        throw new Error(response?.error || "Invalid response from server");
      }
    } catch (error) {
      console.error("Login failed:", error);
      
      // Clear any auth data on failure
      clearAuthData();
      
      const message = error.response?.data?.error || 
                     error.response?.data?.message || 
                     error.message || 
                     "Login failed. Please check your credentials.";
      
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, [clearAuthData, getRoleLandingPage]);

  // Optimized logout function
  const logout = useCallback(() => {
    clearAuthData();
    toast.success("Logged out successfully");
  }, [clearAuthData]);

  // Optimized user update function
  const updateUser = useCallback((userData) => {
    setUser(userData);
    // Update localStorage as well
    localStorage.setItem("user_data", JSON.stringify(userData));
  }, []);

  // Memoized helper function to check if user has specific role
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user?.role]);

  // Memoized helper function to check if user can access certain features
  const canAccess = useCallback((feature) => {
    if (!user?.role) return false;
    return rolePermissions[user.role]?.includes(feature) || false;
  }, [user?.role, rolePermissions]);

  // Memoized helper function to check if user is admin level
  const isAdmin = useCallback(() => {
    return user?.role ? adminRoles.has(user.role) : false;
  }, [user?.role, adminRoles]);

  // Memoized helper function to check if user is super admin
  const isSuperAdmin = useCallback(() => {
    return user?.role === 'super_admin';
  }, [user?.role]);

  // Memoized helper function to get user's permissions
  const getUserPermissions = useCallback(() => {
    if (!user?.role) return [];
    return rolePermissions[user.role] || [];
  }, [user?.role, rolePermissions]);

  // Optimized function to refresh user data from backend
  const refreshUser = useCallback(async () => {
    try {
      const userData = await authService.getProfile();
      if (userData?.user) {
        setUser(userData.user);
        localStorage.setItem("user_data", JSON.stringify(userData.user));
        return userData.user;
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      if (error.response?.status === 401) {
        logout();
      }
    }
    return null;
  }, [logout]);

  // Memoized user-derived state for better performance
  const userState = useMemo(() => ({
    isLoggedIn: isAuthenticated && !!user,
    userRole: user?.role || null,
    userName: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email : null,
    userInitials: user ? 
      `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`.toUpperCase() || 
      user.email?.charAt(0).toUpperCase() : 
      null,
    hasAdminAccess: user?.role ? adminRoles.has(user.role) : false,
    userPermissions: user?.role ? rolePermissions[user.role] || [] : []
  }), [user, isAuthenticated, adminRoles, rolePermissions]);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    // Core state
    user,
    isLoading,
    isAuthenticated,
    
    // Derived state for performance
    ...userState,
    
    // Core functions
    login,
    logout,
    updateUser,
    refreshUser,
    checkAuthStatus,
    
    // Helper functions
    hasRole,
    canAccess,
    isAdmin,
    isSuperAdmin,
    getUserPermissions,
    getRoleLandingPage,
    
    // Utility functions
    clearAuthData,
  }), [
    user,
    isLoading,
    isAuthenticated,
    userState,
    login,
    logout,
    updateUser,
    refreshUser,
    checkAuthStatus,
    hasRole,
    canAccess,
    isAdmin,
    isSuperAdmin,
    getUserPermissions,
    getRoleLandingPage,
    clearAuthData,
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Additional optimized hooks for specific use cases

/**
 * Optimized hook for components that only need user info
 */
export const useUserInfo = () => {
  const { user, userName, userInitials, userRole, isLoading } = useAuth();
  return useMemo(() => ({
    user,
    userName,
    userInitials,
    userRole,
    isLoading
  }), [user, userName, userInitials, userRole, isLoading]);
};

/**
 * Optimized hook for components that only need permissions
 */
export const usePermissions = () => {
  const { canAccess, hasRole, isAdmin, isSuperAdmin, userPermissions } = useAuth();
  return useMemo(() => ({
    canAccess,
    hasRole,
    isAdmin,
    isSuperAdmin,
    userPermissions
  }), [canAccess, hasRole, isAdmin, isSuperAdmin, userPermissions]);
};

/**
 * Optimized hook for components that only need auth state
 */
export const useAuthState = () => {
  const { isAuthenticated, isLoading, isLoggedIn } = useAuth();
  return useMemo(() => ({
    isAuthenticated,
    isLoading,
    isLoggedIn
  }), [isAuthenticated, isLoading, isLoggedIn]);
};

/**
 * Optimized hook for specific role checks
 */
export const useRoleCheck = (requiredRole) => {
  const { hasRole, userRole } = useAuth();
  return useMemo(() => ({
    hasRequiredRole: hasRole(requiredRole),
    userRole
  }), [hasRole, requiredRole, userRole]);
};

/**
 * Optimized hook for permission checks
 */
export const usePermissionCheck = (requiredPermission) => {
  const { canAccess } = useAuth();
  return useMemo(() => 
    canAccess(requiredPermission)
  , [canAccess, requiredPermission]);
};