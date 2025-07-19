import { useState, useEffect, useCallback, useRef } from 'react';

// Basic debounce hook
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Debounced callback hook
export const useDebouncedCallback = (callback, delay, deps = []) => {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay, ...deps]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Cancel function to manually cancel the debounced callback
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return [debouncedCallback, cancel];
};

// Debounced search hook
export const useDebouncedSearch = (initialValue = '', delay = 500) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsSearching(true);
    
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setIsSearching(false);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    isSearching,
    clearSearch,
  };
};

// Debounced input hook with validation
export const useDebouncedInput = (initialValue = '', delay = 500, validator = null) => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    setIsValidating(true);
    setValidationError(null);

    const handler = setTimeout(async () => {
      setDebouncedValue(value);
      
      if (validator && value) {
        try {
          const isValid = await validator(value);
          if (!isValid) {
            setValidationError('Invalid input');
          }
        } catch (error) {
          setValidationError(error.message || 'Validation failed');
        }
      }
      
      setIsValidating(false);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, validator]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setDebouncedValue(initialValue);
    setValidationError(null);
    setIsValidating(false);
  }, [initialValue]);

  return {
    value,
    setValue,
    debouncedValue,
    isValidating,
    validationError,
    reset,
    hasError: !!validationError,
  };
};

// Debounced API call hook
export const useDebouncedApi = (apiFunction, delay = 500, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);

  const execute = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setLoading(true);
    setError(null);

    timeoutRef.current = setTimeout(async () => {
      try {
        const result = await apiFunction(...args);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    }, delay);
  }, [apiFunction, delay, ...dependencies]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    cancel,
  };
};

// Debounced state hook with immediate and delayed values
export const useDebouncedState = (initialValue, delay = 500) => {
  const [immediateValue, setImmediateValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (immediateValue !== debouncedValue) {
      setIsPending(true);
    }

    const handler = setTimeout(() => {
      setDebouncedValue(immediateValue);
      setIsPending(false);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [immediateValue, delay, debouncedValue]);

  const setValue = useCallback((value) => {
    setImmediateValue(value);
  }, []);

  const reset = useCallback(() => {
    setImmediateValue(initialValue);
    setDebouncedValue(initialValue);
    setIsPending(false);
  }, [initialValue]);

  return {
    value: immediateValue,
    debouncedValue,
    setValue,
    isPending,
    reset,
  };
};

// Advanced debounce hook with leading and trailing options
export const useAdvancedDebounce = (callback, delay, options = {}) => {
  const { leading = false, trailing = true, maxWait } = options;
  const timeoutRef = useRef(null);
  const maxTimeoutRef = useRef(null);
  const lastCallTimeRef = useRef(null);
  const lastInvokeTimeRef = useRef(0);

  const invokeFunc = useCallback((args) => {
    lastInvokeTimeRef.current = Date.now();
    return callback(...args);
  }, [callback]);

  const leadingEdge = useCallback((args) => {
    lastInvokeTimeRef.current = Date.now();
    timeoutRef.current = setTimeout(() => trailingEdge(args), delay);
    return leading ? invokeFunc(args) : undefined;
  }, [leading, delay, invokeFunc]);

  const trailingEdge = useCallback((args) => {
    timeoutRef.current = null;
    if (trailing && lastCallTimeRef.current) {
      return invokeFunc(args);
    }
    lastCallTimeRef.current = null;
    return undefined;
  }, [trailing, invokeFunc]);

  const timerExpired = useCallback((args) => {
    const timeSinceLastCall = Date.now() - lastCallTimeRef.current;
    if (timeSinceLastCall < delay && timeSinceLastCall >= 0) {
      timeoutRef.current = setTimeout(() => timerExpired(args), delay - timeSinceLastCall);
    } else {
      return trailingEdge(args);
    }
  }, [delay, trailingEdge]);

  const debouncedCallback = useCallback((...args) => {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastCallTimeRef.current = time;

    if (isInvoking) {
      if (timeoutRef.current === null) {
        return leadingEdge(args);
      }
      if (maxWait) {
        timeoutRef.current = setTimeout(() => timerExpired(args), delay);
        return shouldInvokeMaxWait(time) ? invokeFunc(args) : undefined;
      }
    }

    if (timeoutRef.current === null) {
      timeoutRef.current = setTimeout(() => timerExpired(args), delay);
    }

    return undefined;
  }, [delay, leadingEdge, timerExpired, maxWait, invokeFunc]);

  const shouldInvoke = useCallback((time) => {
    const timeSinceLastCall = time - (lastCallTimeRef.current || 0);
    const timeSinceLastInvoke = time - lastInvokeTimeRef.current;

    return (
      lastCallTimeRef.current === null ||
      timeSinceLastCall >= delay ||
      timeSinceLastCall < 0 ||
      (maxWait && timeSinceLastInvoke >= maxWait)
    );
  }, [delay, maxWait]);

  const shouldInvokeMaxWait = useCallback((time) => {
    return maxWait && (time - lastInvokeTimeRef.current) >= maxWait;
  }, [maxWait]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }
    lastInvokeTimeRef.current = 0;
    lastCallTimeRef.current = null;
  }, []);

  const flush = useCallback(() => {
    return timeoutRef.current ? trailingEdge() : undefined;
  }, [trailingEdge]);

  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return [debouncedCallback, cancel, flush];
};

// Export all hooks
export default {
  useDebounce,
  useDebouncedCallback,
  useDebouncedSearch,
  useDebouncedInput,
  useDebouncedApi,
  useDebouncedState,
  useAdvancedDebounce,
};