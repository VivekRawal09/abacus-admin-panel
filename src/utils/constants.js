// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'https://abacus-backend.vercel.app/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

// Application Configuration
export const APP_CONFIG = {
  NAME: process.env.REACT_APP_APP_NAME || 'ABACUS Admin Panel',
  VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  DESCRIPTION: 'ABACUS Learning Management System - Admin Panel',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
};

// User Roles
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ZONE_MANAGER: 'zone_manager',
  INSTITUTE_ADMIN: 'institute_admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
};

// Role Labels
export const ROLE_LABELS = {
  [USER_ROLES.SUPER_ADMIN]: 'Super Administrator',
  [USER_ROLES.ZONE_MANAGER]: 'Zone Manager',
  [USER_ROLES.INSTITUTE_ADMIN]: 'Institute Administrator',
  [USER_ROLES.TEACHER]: 'Teacher',
  [USER_ROLES.STUDENT]: 'Student',
  [USER_ROLES.PARENT]: 'Parent',
};

// Role Colors for badges
export const ROLE_COLORS = {
  [USER_ROLES.SUPER_ADMIN]: 'bg-purple-100 text-purple-800',
  [USER_ROLES.ZONE_MANAGER]: 'bg-blue-100 text-blue-800',
  [USER_ROLES.INSTITUTE_ADMIN]: 'bg-green-100 text-green-800',
  [USER_ROLES.TEACHER]: 'bg-yellow-100 text-yellow-800',
  [USER_ROLES.STUDENT]: 'bg-indigo-100 text-indigo-800',
  [USER_ROLES.PARENT]: 'bg-pink-100 text-pink-800',
};

// Permission levels for each role
export const ROLE_PERMISSIONS = {
  [USER_ROLES.SUPER_ADMIN]: ['users', 'videos', 'institutes', 'zones', 'analytics', 'settings', 'system'],
  [USER_ROLES.ZONE_MANAGER]: ['users', 'videos', 'institutes', 'analytics', 'reports'],
  [USER_ROLES.INSTITUTE_ADMIN]: ['users', 'videos', 'analytics', 'reports'],
  [USER_ROLES.TEACHER]: ['videos', 'students', 'analytics'],
  [USER_ROLES.STUDENT]: ['videos', 'progress'],
  [USER_ROLES.PARENT]: ['progress', 'reports'],
};

// Video Categories
export const VIDEO_CATEGORIES = {
  BASIC: 'basic',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  TUTORIAL: 'tutorial',
  PRACTICE: 'practice',
  ASSESSMENT: 'assessment',
};

// Video Category Labels
export const VIDEO_CATEGORY_LABELS = {
  [VIDEO_CATEGORIES.BASIC]: 'Basic',
  [VIDEO_CATEGORIES.INTERMEDIATE]: 'Intermediate',
  [VIDEO_CATEGORIES.ADVANCED]: 'Advanced',
  [VIDEO_CATEGORIES.TUTORIAL]: 'Tutorial',
  [VIDEO_CATEGORIES.PRACTICE]: 'Practice',
  [VIDEO_CATEGORIES.ASSESSMENT]: 'Assessment',
};

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  ELEMENTARY: 'elementary',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert',
};

// Difficulty Level Labels
export const DIFFICULTY_LABELS = {
  [DIFFICULTY_LEVELS.BEGINNER]: 'Beginner',
  [DIFFICULTY_LEVELS.ELEMENTARY]: 'Elementary',
  [DIFFICULTY_LEVELS.INTERMEDIATE]: 'Intermediate',
  [DIFFICULTY_LEVELS.ADVANCED]: 'Advanced',
  [DIFFICULTY_LEVELS.EXPERT]: 'Expert',
};

// Status Types
export const STATUS_TYPES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
  DELETED: 'deleted',
};

// Status Labels
export const STATUS_LABELS = {
  [STATUS_TYPES.ACTIVE]: 'Active',
  [STATUS_TYPES.INACTIVE]: 'Inactive',
  [STATUS_TYPES.PENDING]: 'Pending',
  [STATUS_TYPES.SUSPENDED]: 'Suspended',
  [STATUS_TYPES.DELETED]: 'Deleted',
};

// Status Colors
export const STATUS_COLORS = {
  [STATUS_TYPES.ACTIVE]: 'bg-green-100 text-green-800',
  [STATUS_TYPES.INACTIVE]: 'bg-gray-100 text-gray-800',
  [STATUS_TYPES.PENDING]: 'bg-yellow-100 text-yellow-800',
  [STATUS_TYPES.SUSPENDED]: 'bg-red-100 text-red-800',
  [STATUS_TYPES.DELETED]: 'bg-red-100 text-red-800',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  INPUT: 'yyyy-MM-dd',
  INPUT_WITH_TIME: 'yyyy-MM-dd HH:mm',
  API: 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx',
};

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SUCCESS: '#22c55e',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',
  PURPLE: '#8b5cf6',
  PINK: '#ec4899',
  INDIGO: '#6366f1',
};

// Navigation Menu Items
export const NAVIGATION_ITEMS = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'HomeIcon',
    permissions: ['users', 'videos', 'institutes', 'analytics'],
  },
  {
    name: 'Users',
    href: '/users',
    icon: 'UsersIcon',
    permissions: ['users'],
  },
  {
    name: 'Videos',
    href: '/videos',
    icon: 'VideoCameraIcon',
    permissions: ['videos'],
  },
  {
    name: 'Institutes',
    href: '/institutes',
    icon: 'BuildingOfficeIcon',
    permissions: ['institutes'],
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: 'ChartBarIcon',
    permissions: ['analytics'],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: 'CogIcon',
    permissions: ['settings'],
  },
];

// Toast Configuration
export const TOAST_CONFIG = {
  DURATION: 4000,
  POSITION: 'top-right',
  SUCCESS_DURATION: 3000,
  ERROR_DURATION: 5000,
};

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALLOWED_CSV_TYPES: ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
};

// YouTube Configuration
export const YOUTUBE_CONFIG = {
  API_QUOTA_LIMIT: 10000,
  DEFAULT_SEARCH_RESULTS: 25,
  MAX_SEARCH_RESULTS: 50,
  VIDEO_QUALITY_OPTIONS: ['default', 'medium', 'high', 'standard', 'maxres'],
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  TABLE_PREFERENCES: 'table_preferences',
  LAST_VISITED: 'last_visited',
};

// Theme Configuration
export const THEME_CONFIG = {
  DEFAULT: 'light',
  OPTIONS: ['light', 'dark', 'system'],
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. Insufficient permissions.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Logged in successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  SAVE_SUCCESS: 'Changes saved successfully!',
  DELETE_SUCCESS: 'Item deleted successfully!',
  UPDATE_SUCCESS: 'Updated successfully!',
  CREATE_SUCCESS: 'Created successfully!',
  UPLOAD_SUCCESS: 'File uploaded successfully!',
  EXPORT_SUCCESS: 'Data exported successfully!',
  IMPORT_SUCCESS: 'Data imported successfully!',
};

// Animation Durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 1000,
};

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
};

// Export all constants as default
export default {
  API_CONFIG,
  APP_CONFIG,
  USER_ROLES,
  ROLE_LABELS,
  ROLE_COLORS,
  ROLE_PERMISSIONS,
  VIDEO_CATEGORIES,
  VIDEO_CATEGORY_LABELS,
  DIFFICULTY_LEVELS,
  DIFFICULTY_LABELS,
  STATUS_TYPES,
  STATUS_LABELS,
  STATUS_COLORS,
  PAGINATION,
  DATE_FORMATS,
  CHART_COLORS,
  NAVIGATION_ITEMS,
  TOAST_CONFIG,
  UPLOAD_CONFIG,
  YOUTUBE_CONFIG,
  STORAGE_KEYS,
  THEME_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ANIMATION_DURATIONS,
  BREAKPOINTS,
};