import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Helper function to get role-based landing page
  const getRoleLandingPage = (userRole) => {
    switch (userRole) {
      case 'parent':
      case 'student':
        return '/videos'; // Learning-focused landing for end users
      case 'teacher':
        return '/videos'; // Teachers also start with content
      case 'institute_admin':
      case 'zone_manager':
      case 'super_admin':
        return '/dashboard'; // Admin dashboard for management roles
      default:
        return '/dashboard';
    }
  };

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Verify token with backend
      const userData = await authService.getProfile();
      if (userData && userData.user) {
        setUser(userData.user);
        setIsAuthenticated(true);
      } else {
        // Invalid token, remove it
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      
      // If it's a 401 error, token is invalid/expired
      if (error.response?.status === 401) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
      }
      
      // Don't show error toast on initial load if just not authenticated
      if (error.response?.status !== 401) {
        console.error("Authentication verification failed:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);

      // Clear any existing auth data
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");

      // Call real API login
      const response = await authService.login(email, password);

      if (response.success && response.user && response.token) {
        // Store token and user data
        localStorage.setItem("auth_token", response.token);
        localStorage.setItem("user_data", JSON.stringify(response.user));

        // Set user data in state
        setUser(response.user);
        setIsAuthenticated(true);

        // toast.success(`Welcome back, ${response.user.first_name}!`);
        
        // Add role-based redirect
        const landingPage = getRoleLandingPage(response.user.role);
        
        return { 
          success: true,
          redirectTo: landingPage // Return the appropriate landing page
        };
      } else {
        throw new Error(response.error || "Invalid response from server");
      }
    } catch (error) {
      console.error("Login failed:", error);
      
      // Clear any auth data on failure
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      
      const message = error.response?.data?.error || 
                     error.response?.data?.message || 
                     error.message || 
                     "Login failed. Please check your credentials.";
      
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear all auth-related data
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    
    // Clear state
    setUser(null);
    setIsAuthenticated(false);
    
    toast.success("Logged out successfully");
  };

  const updateUser = (userData) => {
    setUser(userData);
    // Update localStorage as well
    localStorage.setItem("user_data", JSON.stringify(userData));
  };

  // Helper function to check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Helper function to check if user can access certain features
  const canAccess = (feature) => {
    if (!user) return false;

    // Role-based permissions mapping
    const permissions = {
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
    };

    return permissions[user.role]?.includes(feature) || false;
  };

  // Helper function to check if user is admin level (can manage users)
  const isAdmin = () => {
    return user && ['super_admin', 'zone_manager', 'institute_admin'].includes(user.role);
  };

  // Helper function to check if user is super admin
  const isSuperAdmin = () => {
    return user?.role === 'super_admin';
  };

  // Helper function to get user's permissions
  const getUserPermissions = () => {
    if (!user) return [];

    const permissionsMap = {
      super_admin: ["users", "videos", "institutes", "zones", "analytics", "settings", "system"],
      zone_manager: ["users", "videos", "institutes", "analytics", "reports"],
      institute_admin: ["users", "videos", "analytics", "reports"],
      teacher: ["videos", "students", "analytics"],
      student: ["videos", "progress"],
      parent: ["progress", "videos", "reports"],
    };

    return permissionsMap[user.role] || [];
  };

  // Helper function to refresh user data from backend
  const refreshUser = async () => {
    try {
      const userData = await authService.getProfile();
      if (userData && userData.user) {
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
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    hasRole,
    canAccess,
    isAdmin,
    isSuperAdmin,
    getUserPermissions,
    refreshUser,
    checkAuthStatus,
    getRoleLandingPage, // Export this for use in other components
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};