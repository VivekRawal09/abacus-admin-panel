import { useState, useEffect, useCallback } from 'react';

// Custom hook for localStorage with React state synchronization
export const useLocalStorage = (key, initialValue) => {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (valueToStore === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes to this localStorage key from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
};

// Hook for storing objects with typed returns
export const useLocalStorageObject = (key, initialValue = {}) => {
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue);

  const updateObject = useCallback((updates) => {
    setValue(prev => ({ ...prev, ...updates }));
  }, [setValue]);

  const updateProperty = useCallback((property, newValue) => {
    setValue(prev => ({ ...prev, [property]: newValue }));
  }, [setValue]);

  const removeProperty = useCallback((property) => {
    setValue(prev => {
      const newObj = { ...prev };
      delete newObj[property];
      return newObj;
    });
  }, [setValue]);

  return {
    value,
    setValue,
    removeValue,
    updateObject,
    updateProperty,
    removeProperty,
  };
};

// Hook for storing arrays
export const useLocalStorageArray = (key, initialValue = []) => {
  const [array, setArray, removeArray] = useLocalStorage(key, initialValue);

  const addItem = useCallback((item) => {
    setArray(prev => [...prev, item]);
  }, [setArray]);

  const removeItem = useCallback((index) => {
    setArray(prev => prev.filter((_, i) => i !== index));
  }, [setArray]);

  const removeItemById = useCallback((id, idKey = 'id') => {
    setArray(prev => prev.filter(item => item[idKey] !== id));
  }, [setArray]);

  const updateItem = useCallback((index, newItem) => {
    setArray(prev => prev.map((item, i) => i === index ? newItem : item));
  }, [setArray]);

  const updateItemById = useCallback((id, updates, idKey = 'id') => {
    setArray(prev => prev.map(item => 
      item[idKey] === id ? { ...item, ...updates } : item
    ));
  }, [setArray]);

  const clearArray = useCallback(() => {
    setArray([]);
  }, [setArray]);

  const findItem = useCallback((predicate) => {
    return array.find(predicate);
  }, [array]);

  const findItemById = useCallback((id, idKey = 'id') => {
    return array.find(item => item[idKey] === id);
  }, [array]);

  return {
    array,
    setArray,
    removeArray,
    addItem,
    removeItem,
    removeItemById,
    updateItem,
    updateItemById,
    clearArray,
    findItem,
    findItemById,
    length: array.length,
  };
};

// Hook for storing user preferences
export const useUserPreferences = () => {
  const {
    value: preferences,
    updateProperty,
    updateObject,
    removeProperty,
  } = useLocalStorageObject('user_preferences', {
    theme: 'light',
    sidebarCollapsed: false,
    tablePageSize: 20,
    language: 'en',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  });

  const setTheme = useCallback((theme) => {
    updateProperty('theme', theme);
  }, [updateProperty]);

  const setSidebarCollapsed = useCallback((collapsed) => {
    updateProperty('sidebarCollapsed', collapsed);
  }, [updateProperty]);

  const setTablePageSize = useCallback((pageSize) => {
    updateProperty('tablePageSize', pageSize);
  }, [updateProperty]);

  const setLanguage = useCallback((language) => {
    updateProperty('language', language);
  }, [updateProperty]);

  const updateNotifications = useCallback((notificationUpdates) => {
    updateProperty('notifications', {
      ...preferences.notifications,
      ...notificationUpdates,
    });
  }, [updateProperty, preferences.notifications]);

  return {
    preferences,
    setTheme,
    setSidebarCollapsed,
    setTablePageSize,
    setLanguage,
    updateNotifications,
    updatePreference: updateProperty,
    updatePreferences: updateObject,
    removePreference: removeProperty,
  };
};

// Hook for managing recently viewed items
export const useRecentItems = (key = 'recent_items', maxItems = 10) => {
  const { array: items, setArray, addItem } = useLocalStorageArray(key, []);

  const addRecentItem = useCallback((item) => {
    const existingIndex = items.findIndex(existing => existing.id === item.id);
    
    if (existingIndex !== -1) {
      // Move existing item to top
      const updatedItems = [item, ...items.filter((_, i) => i !== existingIndex)];
      setArray(updatedItems.slice(0, maxItems));
    } else {
      // Add new item to top and limit array size
      const updatedItems = [item, ...items];
      setArray(updatedItems.slice(0, maxItems));
    }
  }, [items, setArray, maxItems]);

  const removeRecentItem = useCallback((id) => {
    setArray(prev => prev.filter(item => item.id !== id));
  }, [setArray]);

  const clearRecentItems = useCallback(() => {
    setArray([]);
  }, [setArray]);

  return {
    recentItems: items,
    addRecentItem,
    removeRecentItem,
    clearRecentItems,
  };
};

// Hook for managing search history
export const useSearchHistory = (key = 'search_history', maxItems = 20) => {
  const { array: history, setArray } = useLocalStorageArray(key, []);

  const addSearchTerm = useCallback((term) => {
    if (!term || term.trim() === '') return;
    
    const trimmedTerm = term.trim();
    const existingIndex = history.findIndex(item => item.toLowerCase() === trimmedTerm.toLowerCase());
    
    if (existingIndex !== -1) {
      // Move existing term to top
      const updatedHistory = [trimmedTerm, ...history.filter((_, i) => i !== existingIndex)];
      setArray(updatedHistory.slice(0, maxItems));
    } else {
      // Add new term to top
      const updatedHistory = [trimmedTerm, ...history];
      setArray(updatedHistory.slice(0, maxItems));
    }
  }, [history, setArray, maxItems]);

  const removeSearchTerm = useCallback((term) => {
    setArray(prev => prev.filter(item => item !== term));
  }, [setArray]);

  const clearSearchHistory = useCallback(() => {
    setArray([]);
  }, [setArray]);

  return {
    searchHistory: history,
    addSearchTerm,
    removeSearchTerm,
    clearSearchHistory,
  };
};

// Export all hooks
export default {
  useLocalStorage,
  useLocalStorageObject,
  useLocalStorageArray,
  useUserPreferences,
  useRecentItems,
  useSearchHistory,
};