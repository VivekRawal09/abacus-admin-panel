import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation as useReactQueryMutation, useQueryClient, useInfiniteQuery } from 'react-query';
import toast from 'react-hot-toast';

// Custom hook for API calls with React Query
export const useApi = (key, apiFunction, options = {}) => {
  const {
    enabled = true,
    onSuccess,
    onError,
    showSuccessToast = false,
    showErrorToast = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    cacheTime = 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus = false,
    retry = 1,
    retryDelay = 1000,
    ...queryOptions
  } = options;

  const query = useQuery(
    key,
    async () => {
      try {
        const result = await apiFunction();
        return result;
      } catch (error) {
        // Log error for debugging
        console.error(`API Error for ${key}:`, error);
        throw error;
      }
    },
    {
      enabled,
      staleTime,
      cacheTime,
      refetchOnWindowFocus,
      retry,
      retryDelay,
      onSuccess: (data) => {
        if (showSuccessToast) {
          toast.success('Data loaded successfully');
        }
        if (onSuccess) {
          onSuccess(data);
        }
      },
      onError: (error) => {
        if (showErrorToast) {
          const message = getErrorMessage(error);
          toast.error(message);
        }
        if (onError) {
          onError(error);
        }
      },
      ...queryOptions,
    }
  );

  return {
    ...query,
    // Add convenience properties
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
    data: query.data,
    error: query.error,
  };
};

// Custom hook for mutations (POST, PUT, DELETE)
export const useApiMutation = (apiFunction, options = {}) => {
  const queryClient = useQueryClient();
  const {
    onSuccess,
    onError,
    invalidateQueries = [],
    showSuccessToast = true,
    showErrorToast = true,
    successMessage,
    ...mutationOptions
  } = options;

  const mutation = useReactQueryMutation(
    async (variables) => {
      try {
        const result = await apiFunction(variables);
        return result;
      } catch (error) {
        console.error('Mutation Error:', error);
        throw error;
      }
    },
    {
      onSuccess: (data, variables, context) => {
        // Invalidate specified queries
        invalidateQueries.forEach(queryKey => {
          if (Array.isArray(queryKey)) {
            queryClient.invalidateQueries(queryKey);
          } else {
            queryClient.invalidateQueries([queryKey]);
          }
        });

        if (showSuccessToast) {
          toast.success(successMessage || getSuccessMessage(data) || 'Operation completed successfully');
        }

        if (onSuccess) {
          onSuccess(data, variables, context);
        }
      },
      onError: (error, variables, context) => {
        if (showErrorToast) {
          const message = getErrorMessage(error);
          toast.error(message);
        }

        if (onError) {
          onError(error, variables, context);
        }
      },
      ...mutationOptions,
    }
  );

  return mutation;
};

// Custom hook for paginated data
// FIND THIS IN YOUR useApi.js AND REPLACE THE usePaginatedApi FUNCTION

// Custom hook for paginated data
// FIND THIS IN YOUR useApi.js AND REPLACE THE usePaginatedApi FUNCTION

// Custom hook for paginated data
export const usePaginatedApi = (key, apiFunction, initialParams = {}) => {
  const [params, setParams] = useState({
    page: 1,
    limit: 20,
    ...initialParams,
  });

  const query = useQuery(
    [key, params],
    async () => {
      try {
        const result = await apiFunction(params);
        return result;
      } catch (error) {
        console.error(`Paginated API Error for ${key}:`, error);
        throw error;
      }
    },
    {
      keepPreviousData: true,
      staleTime: 2 * 60 * 1000, // 2 minutes for paginated data
      onError: (error) => {
        const message = getErrorMessage(error);
        toast.error(message);
      },
    }
  );

  const updateParams = useCallback((newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  const nextPage = useCallback(() => {
    setParams(prev => ({ ...prev, page: prev.page + 1 }));
  }, []);

  const prevPage = useCallback(() => {
    setParams(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }));
  }, []);

  const goToPage = useCallback((page) => {
    setParams(prev => ({ ...prev, page: Math.max(1, page) }));
  }, []);

  const changePageSize = useCallback((limit) => {
    setParams(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  const search = useCallback((searchTerm) => {
    setParams(prev => ({ ...prev, search: searchTerm, page: 1 }));
  }, []);

  const filter = useCallback((filterData) => {
    setParams(prev => ({ ...prev, ...filterData, page: 1 }));
  }, []);

  const sort = useCallback((sortField, sortOrder = 'asc') => {
    setParams(prev => ({ ...prev, sort: sortField, order: sortOrder, page: 1 }));
  }, []);

  // FIXED: Extract pagination info correctly from response
  // The response from service should be: { data: [...], pagination: {...} }
  const responseData = query.data;
  
  let paginationInfo = {
    currentPage: params.page,
    totalPages: 1,
    totalItems: 0,
    pageSize: params.limit
  };

  let extractedData = [];

  if (responseData) {
    // FIXED: Handle both formats properly
    if (responseData.pagination && responseData.data) {
      // Format: { data: [...], pagination: {...} }
      paginationInfo = responseData.pagination;
      extractedData = responseData.data;
    } else if (Array.isArray(responseData)) {
      // Format: [item1, item2, item3] (direct array)
      extractedData = responseData;
      paginationInfo = {
        currentPage: params.page,
        totalPages: 1,
        totalItems: responseData.length,
        pageSize: params.limit
      };
    } else if (responseData.success && responseData.data) {
      // Format: { success: true, data: [...], pagination: {...} }
      extractedData = responseData.data;
      paginationInfo = responseData.pagination || paginationInfo;
    }
  }

  const hasNextPage = paginationInfo.currentPage < paginationInfo.totalPages;
  const hasPrevPage = paginationInfo.currentPage > 1;

  return {
    ...query,
    // FIXED: Return structured data for component to use easily
    data: {
      data: extractedData,           // The actual array of items
      pagination: paginationInfo     // The pagination info
    },
    params,
    updateParams,
    nextPage,
    prevPage,
    goToPage,
    changePageSize,
    search,
    filter,
    sort,
    pagination: paginationInfo,
    hasNextPage,
    hasPrevPage,
    // FIXED: These should extract the actual data and pagination
    totalItems: paginationInfo.totalItems,
    currentPage: paginationInfo.currentPage,
    totalPages: paginationInfo.totalPages,
  };
};

// Custom hook for infinite scrolling
export const useInfiniteApi = (key, apiFunction, options = {}) => {
  const {
    enabled = true,
    initialParams = {},
    getNextPageParam = (lastPage, pages) => {
      if (lastPage?.pagination?.hasNext) {
        return pages.length + 1;
      }
      return undefined;
    },
    ...queryOptions
  } = options;

  const query = useInfiniteQuery(
    key,
    async ({ pageParam = 1 }) => {
      try {
        const result = await apiFunction({ ...initialParams, page: pageParam });
        return result;
      } catch (error) {
        console.error(`Infinite API Error for ${key}:`, error);
        throw error;
      }
    },
    {
      enabled,
      getNextPageParam,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      onError: (error) => {
        const message = getErrorMessage(error);
        toast.error(message);
      },
      ...queryOptions,
    }
  );

  // Flatten all pages data
  const flatData = query.data?.pages?.reduce((acc, page) => {
    return [...acc, ...(page.data || [])];
  }, []) || [];

  return {
    ...query,
    data: flatData,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
};

// Helper function to extract error message
const getErrorMessage = (error) => {
  // Handle different error formats
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};

// Helper function to extract success message
const getSuccessMessage = (data) => {
  if (data?.message) {
    return data.message;
  }
  if (data?.success && typeof data.success === 'string') {
    return data.success;
  }
  return null;
};

// Custom hook for real-time data (WebSocket or polling)
export const useRealTimeApi = (key, apiFunction, options = {}) => {
  const {
    enabled = true,
    pollingInterval = 30000, // 30 seconds
    onDataUpdate,
    ...queryOptions
  } = options;

  const query = useQuery(
    key,
    apiFunction,
    {
      enabled,
      refetchInterval: enabled ? pollingInterval : false,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: true,
      onSuccess: (data) => {
        if (onDataUpdate) {
          onDataUpdate(data);
        }
      },
      onError: (error) => {
        console.error(`Real-time API Error for ${key}:`, error);
        // Don't show toast for real-time errors to avoid spam
      },
      ...queryOptions,
    }
  );
  

  return query;
};

// Export all hooks
export default {
  useApi,
  useApiMutation,
  usePaginatedApi,
  useInfiniteApi,
  useRealTimeApi,
};