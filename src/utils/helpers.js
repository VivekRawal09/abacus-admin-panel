import { format, parseISO, isValid, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { DATE_FORMATS, USER_ROLES, ROLE_PERMISSIONS } from './constants';

// Date and Time Utilities
export const dateHelpers = {
  // Format date for display
  formatDate: (date, formatString = DATE_FORMATS.DISPLAY) => {
    if (!date) return '';
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return isValid(dateObj) ? format(dateObj, formatString) : '';
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  },

  // Format date with time
  formatDateTime: (date) => {
    return dateHelpers.formatDate(date, DATE_FORMATS.DISPLAY_WITH_TIME);
  },

  // Get relative time (e.g., "2 hours ago")
  getRelativeTime: (date) => {
    if (!date) return '';
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      const now = new Date();
      
      const days = differenceInDays(now, dateObj);
      const hours = differenceInHours(now, dateObj);
      const minutes = differenceInMinutes(now, dateObj);
      
      if (days > 0) {
        return days === 1 ? '1 day ago' : `${days} days ago`;
      } else if (hours > 0) {
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
      } else if (minutes > 0) {
        return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
      } else {
        return 'Just now';
      }
    } catch (error) {
      console.error('Relative time error:', error);
      return '';
    }
  },

  // Check if date is today
  isToday: (date) => {
    if (!date) return false;
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      const today = new Date();
      return differenceInDays(today, dateObj) === 0;
    } catch (error) {
      return false;
    }
  },

  // Get date range for common periods
  getDateRange: (period) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (period) {
      case 'today':
        return {
          startDate: today,
          endDate: now
        };
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return {
          startDate: yesterday,
          endDate: yesterday
        };
      case 'last7days':
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);
        return {
          startDate: last7Days,
          endDate: now
        };
      case 'last30days':
        const last30Days = new Date(today);
        last30Days.setDate(last30Days.getDate() - 30);
        return {
          startDate: last30Days,
          endDate: now
        };
      case 'thisMonth':
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return {
          startDate: thisMonthStart,
          endDate: now
        };
      case 'lastMonth':
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        return {
          startDate: lastMonthStart,
          endDate: lastMonthEnd
        };
      default:
        return {
          startDate: today,
          endDate: now
        };
    }
  }
};

// String Utilities
export const stringHelpers = {
  // Capitalize first letter
  capitalize: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  // Convert to title case
  toTitleCase: (str) => {
    if (!str) return '';
    return str.replace(/\w\S*/g, (txt) =>
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  // Truncate string with ellipsis
  truncate: (str, length = 100) => {
    if (!str) return '';
    return str.length > length ? `${str.substring(0, length)}...` : str;
  },

  // Generate initials from name
  getInitials: (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${first}${last}`;
  },

  // Convert snake_case to camelCase
  toCamelCase: (str) => {
    return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
  },

  // Convert camelCase to snake_case
  toSnakeCase: (str) => {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  },

  // Generate slug from string
  slugify: (str) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  // Extract YouTube video ID from URL
  extractYouTubeId: (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
};

// Number Utilities
export const numberHelpers = {
  // Format number with commas
  formatNumber: (num) => {
    if (num === null || num === undefined) return '0';
    return Number(num).toLocaleString();
  },

  // Format percentage
  formatPercentage: (value, total, decimals = 1) => {
    if (!total || total === 0) return '0%';
    const percentage = (value / total) * 100;
    return `${percentage.toFixed(decimals)}%`;
  },

  // Format file size
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Format duration (seconds to HH:MM:SS)
  formatDuration: (seconds) => {
    if (!seconds) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  },

  // Generate random number in range
  randomInRange: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Calculate average
  average: (numbers) => {
    if (!numbers || numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
  }
};

// Array Utilities
export const arrayHelpers = {
  // Remove duplicates from array
  unique: (arr) => {
    return [...new Set(arr)];
  },

  // Group array by key
  groupBy: (arr, key) => {
    return arr.reduce((groups, item) => {
      const group = item[key];
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
      return groups;
    }, {});
  },

  // Sort array by multiple keys
  sortBy: (arr, keys) => {
    return arr.sort((a, b) => {
      for (let key of keys) {
        const isDesc = key.startsWith('-');
        const cleanKey = isDesc ? key.substring(1) : key;
        
        let aVal = a[cleanKey];
        let bVal = b[cleanKey];
        
        if (aVal < bVal) return isDesc ? 1 : -1;
        if (aVal > bVal) return isDesc ? -1 : 1;
      }
      return 0;
    });
  },

  // Chunk array into smaller arrays
  chunk: (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  },

  // Find item by property
  findBy: (arr, key, value) => {
    return arr.find(item => item[key] === value);
  },

  // Filter and search array
  filterAndSearch: (arr, searchTerm, searchKeys) => {
    if (!searchTerm) return arr;
    
    const term = searchTerm.toLowerCase();
    return arr.filter(item => {
      return searchKeys.some(key => {
        const value = item[key];
        return value && value.toString().toLowerCase().includes(term);
      });
    });
  }
};

// Validation Utilities
export const validationHelpers = {
  // Email validation
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Phone validation
  isValidPhone: (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s|-/g, ''));
  },

  // URL validation
  isValidUrl: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // YouTube URL validation
  isValidYouTubeUrl: (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  },

  // Password strength validation
  validatePassword: (password) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: minLength && hasUpper && hasLower && hasNumber,
      criteria: {
        minLength,
        hasUpper,
        hasLower,
        hasNumber,
        hasSpecial
      }
    };
  },

  // Required field validation
  isRequired: (value) => {
    return value !== null && value !== undefined && value !== '';
  }
};

// Permission Utilities
export const permissionHelpers = {
  // Check if user has permission
  hasPermission: (userRole, permission) => {
    const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
    return rolePermissions.includes(permission);
  },

  // Check if user can access feature
  canAccess: (userRole, feature) => {
    return permissionHelpers.hasPermission(userRole, feature);
  },

  // Get user's permissions
  getUserPermissions: (userRole) => {
    return ROLE_PERMISSIONS[userRole] || [];
  },

  // Check if user is admin
  isAdmin: (userRole) => {
    return [USER_ROLES.SUPER_ADMIN, USER_ROLES.ZONE_MANAGER, USER_ROLES.INSTITUTE_ADMIN].includes(userRole);
  },

  // Check if user is super admin
  isSuperAdmin: (userRole) => {
    return userRole === USER_ROLES.SUPER_ADMIN;
  }
};

// Local Storage Utilities
export const storageHelpers = {
  // Set item in localStorage
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('LocalStorage set error:', error);
      return false;
    }
  },

  // Get item from localStorage
  getItem: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('LocalStorage get error:', error);
      return defaultValue;
    }
  },

  // Remove item from localStorage
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('LocalStorage remove error:', error);
      return false;
    }
  },

  // Clear all localStorage
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('LocalStorage clear error:', error);
      return false;
    }
  }
};

// Export all helpers
export default {
  dateHelpers,
  stringHelpers,
  numberHelpers,
  arrayHelpers,
  validationHelpers,
  permissionHelpers,
  storageHelpers,
};