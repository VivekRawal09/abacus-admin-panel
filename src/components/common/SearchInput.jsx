import React, { useState, useRef, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { Combobox, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { useDebouncedSearch } from '../../hooks/useDebounce';
import { useSearchHistory } from '../../hooks/useLocalStorage';

const SearchInput = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  onSearch,
  onClear,
  suggestions = [],
  loading = false,
  disabled = false,
  size = 'medium',
  className = '',
  showHistory = true,
  showSuggestions = true,
  debounceMs = 300,
  maxSuggestions = 5,
  icon = true,
  clearable = true,
  autoFocus = false,
  historyKey = 'search_history',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState(value);
  const inputRef = useRef(null);

  const { searchHistory, addSearchTerm, removeSearchTerm, clearSearchHistory } = useSearchHistory(historyKey);
  const { debouncedSearchTerm, isSearching } = useDebouncedSearch(query, debounceMs);

  // Handle debounced search
  useEffect(() => {
    if (debouncedSearchTerm && onSearch) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch]);

  // Update internal state when external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-4 py-3 text-base',
  };

  const iconSizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-5 w-5',
    large: 'h-6 w-6',
  };

  const handleInputChange = (newValue) => {
    setQuery(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      addSearchTerm(searchTerm.trim());
      if (onSearch) {
        onSearch(searchTerm.trim());
      }
    }
    setIsFocused(false);
  };

  const handleClear = () => {
    setQuery('');
    if (onChange) {
      onChange('');
    }
    if (onClear) {
      onClear();
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(query);
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  // Filter and combine suggestions with history
  const combinedSuggestions = React.useMemo(() => {
    const filtered = suggestions.filter(item => 
      item.toLowerCase().includes(query.toLowerCase())
    ).slice(0, maxSuggestions);

    const historyItems = query.trim() 
      ? searchHistory.filter(item => 
          item.toLowerCase().includes(query.toLowerCase())
        ).slice(0, maxSuggestions)
      : searchHistory.slice(0, maxSuggestions);

    // Combine and deduplicate
    const combined = [...new Set([...filtered, ...historyItems])];
    return combined.slice(0, maxSuggestions);
  }, [suggestions, searchHistory, query, maxSuggestions]);

  const showDropdown = isFocused && (
    (showSuggestions && combinedSuggestions.length > 0) ||
    (showHistory && !query.trim() && searchHistory.length > 0)
  );

  return (
    <Combobox value={query} onChange={handleSearch}>
      <div className={classNames('relative', className)}>
        <div className="relative">
          {/* Search Icon */}
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon 
                className={classNames(
                  'text-gray-400',
                  iconSizeClasses[size]
                )} 
              />
            </div>
          )}

          {/* Input */}
          <Combobox.Input
            ref={inputRef}
            className={classNames(
              'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500',
              sizeClasses[size],
              {
                'pl-10': icon,
                'pr-10': clearable && query,
                'opacity-50 cursor-not-allowed': disabled,
              }
            )}
            placeholder={placeholder}
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            autoComplete="off"
          />

          {/* Loading Spinner */}
          {(loading || isSearching) && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className={classNames(
                'animate-spin rounded-full border-2 border-gray-300 border-t-primary-600',
                iconSizeClasses[size]
              )} />
            </div>
          )}

          {/* Clear Button */}
          {clearable && query && !loading && !isSearching && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
            >
              <XMarkIcon className={classNames('text-gray-400', iconSizeClasses[size])} />
            </button>
          )}
        </div>

        {/* Dropdown */}
        <Transition
          show={showDropdown}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Combobox.Options className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {/* Search History Section */}
            {showHistory && !query.trim() && searchHistory.length > 0 && (
              <>
                <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      Recent Searches
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        clearSearchHistory();
                      }}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                {searchHistory.slice(0, maxSuggestions).map((item, index) => (
                  <Combobox.Option
                    key={`history-${index}`}
                    value={item}
                    className={({ active }) =>
                      classNames(
                        'relative cursor-pointer select-none py-2 pl-3 pr-9',
                        active ? 'bg-primary-600 text-white' : 'text-gray-900'
                      )
                    }
                  >
                    {({ active }) => (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <ClockIcon className={classNames(
                            'h-4 w-4 mr-2',
                            active ? 'text-white' : 'text-gray-400'
                          )} />
                          <span className="truncate">{item}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeSearchTerm(item);
                          }}
                          className={classNames(
                            'p-1 rounded hover:bg-opacity-20 hover:bg-gray-500',
                            active ? 'text-white' : 'text-gray-400'
                          )}
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </Combobox.Option>
                ))}
              </>
            )}

            {/* Suggestions Section */}
            {showSuggestions && combinedSuggestions.length > 0 && query.trim() && (
              <>
                {searchHistory.length > 0 && !query.trim() && (
                  <div className="border-t border-gray-100" />
                )}
                <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  <span className="flex items-center">
                   <ArrowTrendingUpIcon className="self-center flex-shrink-0 h-4 w-4" />
                    Suggestions
                  </span>
                </div>
                {combinedSuggestions.map((item, index) => {
                  const isHistory = searchHistory.includes(item);
                  return (
                    <Combobox.Option
                      key={`suggestion-${index}`}
                      value={item}
                      className={({ active }) =>
                        classNames(
                          'relative cursor-pointer select-none py-2 pl-3 pr-9',
                          active ? 'bg-primary-600 text-white' : 'text-gray-900'
                        )
                      }
                    >
                      {({ active }) => (
                        <div className="flex items-center">
                          {isHistory ? (
                            <ClockIcon className={classNames(
                              'h-4 w-4 mr-2',
                              active ? 'text-white' : 'text-gray-400'
                            )} />
                          ) : (
                            <MagnifyingGlassIcon className={classNames(
                              'h-4 w-4 mr-2',
                              active ? 'text-white' : 'text-gray-400'
                            )} />
                          )}
                          <span className="truncate">{item}</span>
                        </div>
                      )}
                    </Combobox.Option>
                  );
                })}
              </>
            )}

            {/* No Results */}
            {query.trim() && combinedSuggestions.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">
                No suggestions found for "{query}"
              </div>
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};

// Advanced search input with filters
export const AdvancedSearchInput = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  onSearch,
  filters = [],
  activeFilters = {},
  onFilterChange,
  suggestions = [],
  className = '',
  ...props
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = Object.keys(activeFilters).filter(key => 
    activeFilters[key] && activeFilters[key] !== ''
  ).length;

  return (
    <div className={classNames('space-y-3', className)}>
      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <SearchInput
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onSearch={onSearch}
            suggestions={suggestions}
            {...props}
          />
        </div>
        
        {filters.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={classNames(
              'btn btn-outline relative',
              {
                'bg-primary-50 border-primary-300 text-primary-700': activeFilterCount > 0,
              }
            )}
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 bg-primary-600 text-white text-xs rounded-full px-1.5 py-0.5">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && filters.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="form-label">{filter.label}</label>
                {filter.type === 'select' ? (
                  <select
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
                    className="form-select"
                  >
                    <option value="">All {filter.label}</option>
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : filter.type === 'date' ? (
                  <input
                    type="date"
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
                    className="form-input"
                  />
                ) : (
                  <input
                    type="text"
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
                    placeholder={filter.placeholder}
                    className="form-input"
                  />
                )}
              </div>
            ))}
          </div>
          
          {activeFilterCount > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <button
                onClick={() => {
                  const clearedFilters = {};
                  filters.forEach(filter => {
                    clearedFilters[filter.key] = '';
                  });
                  onFilterChange?.(clearedFilters);
                }}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;