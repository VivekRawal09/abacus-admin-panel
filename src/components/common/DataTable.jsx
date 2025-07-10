import React, { useState, useMemo, useCallback, memo } from 'react';
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  EllipsisVerticalIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import classNames from 'classnames';
import { TableSkeleton } from './LoadingSpinner';

/**
 * FIXED DataTable Component - Performance Optimized WITHOUT Breaking Changes
 * Maintains backward compatibility while adding performance improvements
 */
const DataTable = memo(({
  data = [],
  columns = [],
  loading = false,
  error = null,
  pagination,
  sorting,
  onSort,
  onPageChange,
  onPageSizeChange,
  onSearch,
  onFilter,
  onRefresh,
  selectable = false,
  selectedRows = [],
  onRowSelect,
  onSelectAll,
  // FIXED: Made these optional to maintain backward compatibility
  isAllSelected,
  isIndeterminate,
  actions = [],
  emptyMessage = 'No data available',
  searchPlaceholder = 'Search...',
  className = '',
  rowClassName = '',
  headerClassName = '',
  showSearch = true,
  showFilter = true,
  showRefresh = true,
  stickyHeader = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // FIXED: Calculate selection state internally if not provided
  const calculatedAllSelected = useMemo(() => {
    if (isAllSelected !== undefined) return isAllSelected;
    return data.length > 0 && selectedRows.length === data.length;
  }, [isAllSelected, data.length, selectedRows.length]);

  const calculatedIndeterminate = useMemo(() => {
    if (isIndeterminate !== undefined) return isIndeterminate;
    return selectedRows.length > 0 && selectedRows.length < data.length;
  }, [isIndeterminate, selectedRows.length, data.length]);

  // Memoized search handler
  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  }, [onSearch]);

  // Memoized sort icon rendering
  const getSortIcon = useCallback((column) => {
    if (!column.sortable || !sorting) return null;
    
    const isActive = sorting.column === column.key;
    const direction = sorting.direction;

    if (!isActive) {
      return (
        <div className="flex flex-col opacity-30">
          <ChevronUpIcon className="h-3 w-3 -mb-1" />
          <ChevronDownIcon className="h-3 w-3" />
        </div>
      );
    }

    return direction === 'asc' ? (
      <ChevronUpIcon className="h-4 w-4 text-primary-600" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 text-primary-600" />
    );
  }, [sorting]);

  // Memoized column click handler
  const handleColumnClick = useCallback((column) => {
    if (!column.sortable || !onSort) return;
    
    let direction = 'asc';
    if (sorting?.column === column.key && sorting.direction === 'asc') {
      direction = 'desc';
    }
    
    onSort(column.key, direction);
  }, [sorting, onSort]);

  // Memoized cell renderer
  const renderCell = useCallback((item, column) => {
    if (column.render) {
      return column.render(item[column.key], item);
    }
    
    const value = item[column.key];
    
    if (value === null || value === undefined) {
      return <span className="text-gray-400">—</span>;
    }
    
    return value;
  }, []);

  // Memoized row selection handler
  const handleRowSelection = useCallback((item) => {
    if (onRowSelect) {
      onRowSelect(item);
    }
  }, [onRowSelect]);

  // Memoized select all handler
  const handleSelectAll = useCallback(() => {
    if (onSelectAll) {
      onSelectAll(!calculatedAllSelected);
    }
  }, [onSelectAll, calculatedAllSelected]);

  // Memoized row selection checker
  const isRowSelected = useCallback((item) => {
    return selectedRows.some(selected => selected.id === item.id);
  }, [selectedRows]);

  if (loading) {
    return <TableSkeleton rows={10} columns={columns.length} className={className} />;
  }

  if (error) {
    return (
      <div className={classNames('bg-white rounded-lg shadow-sm border border-gray-200 p-6', className)}>
        <div className="text-center py-8">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">Failed to Load Data</h3>
          <p className="text-red-700 mb-4">{error}</p>
          {showRefresh && onRefresh && (
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2 inline" />
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={classNames('bg-white rounded-lg shadow-sm border border-gray-200', className)}>
      {/* Table Header with Search and Actions */}
      {(showSearch || showFilter || showRefresh || actions.length > 0) && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex-1 flex items-center space-x-3">
              {/* Search */}
              {showSearch && (
                <div className="relative max-w-xs">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors"
                  />
                </div>
              )}

              {/* Filter */}
              {showFilter && onFilter && (
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className={classNames(
                    "btn btn-outline transition-colors",
                    { "bg-primary-50 border-primary-300": filterOpen }
                  )}
                >
                  <FunnelIcon className="h-4 w-4 mr-2" />
                  Filter
                </button>
              )}

              {/* Selected count */}
              {selectable && selectedRows.length > 0 && (
                <span className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                  {selectedRows.length} selected
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {/* Refresh */}
              {showRefresh && onRefresh && (
                <button
                  onClick={onRefresh}
                  className="btn btn-ghost hover:bg-gray-100 transition-colors"
                  title="Refresh"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                </button>
              )}

              {/* Actions */}
              {actions.length > 0 && (
                <div className="flex items-center space-x-2">
                  {actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.onClick}
                      disabled={action.disabled}
                      className={classNames('btn transition-colors', action.className || 'btn-primary')}
                    >
                      {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table">
          <thead className={classNames('table-header', headerClassName, {
            'sticky top-0 z-10': stickyHeader
          })}>
            <tr>
              {/* Selection checkbox */}
              {selectable && (
                <th className="w-12">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={calculatedAllSelected}
                      ref={(input) => {
                        if (input) input.indeterminate = calculatedIndeterminate;
                      }}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                </th>
              )}

              {/* Column headers */}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={classNames(
                    column.className,
                    {
                      'cursor-pointer hover:bg-gray-100 transition-colors': column.sortable,
                    }
                  )}
                  onClick={() => handleColumnClick(column)}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {getSortIcon(column)}
                  </div>
                </th>
              ))}

              {/* Actions column */}
              {columns.some(col => col.actions) && (
                <th className="w-12">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>

          <tbody className="table-body">
            {data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0) + (columns.some(col => col.actions) ? 1 : 0)}
                  className="text-center py-12"
                >
                  <div className="text-gray-500">
                    <p className="text-lg font-medium">{emptyMessage}</p>
                    <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={item.id || index}
                  className={classNames(
                    'table-row hover:bg-gray-50 transition-colors',
                    {
                      'bg-primary-50': isRowSelected(item),
                    },
                    typeof rowClassName === 'function' ? rowClassName(item) : rowClassName
                  )}
                >
                  {/* Selection checkbox */}
                  {selectable && (
                    <td>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isRowSelected(item)}
                          onChange={() => handleRowSelection(item)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </div>
                    </td>
                  )}

                  {/* Data cells */}
                  {columns.map((column) => (
                    <td key={column.key} className={column.cellClassName}>
                      {renderCell(item, column)}
                    </td>
                  ))}

                  {/* Row actions */}
                  {columns.some(col => col.actions) && (
                    <td>
                      <RowActionsMenu 
                        item={item}
                        actions={columns.find(col => col.actions)?.actions || []}
                      />
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <TablePagination
          pagination={pagination}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
});

DataTable.displayName = 'DataTable';

// FIXED: Simplified Row Actions Menu to avoid breaking changes
const RowActionsMenu = memo(({ item, actions }) => {
  if (!actions || actions.length === 0) return null;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors">
        <EllipsisVerticalIcon className="h-4 w-4 text-gray-500" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {actions.map((action, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <button
                    onClick={() => action.onClick(item)}
                    disabled={action.disabled?.(item)}
                    className={classNames(
                      'flex items-center w-full px-4 py-2 text-sm text-left transition-colors',
                      {
                        'bg-gray-100 text-gray-900': active,
                        'text-gray-700': !active,
                        'opacity-50 cursor-not-allowed': action.disabled?.(item),
                        'text-danger-600 hover:bg-red-50': action.variant === 'danger',
                      }
                    )}
                  >
                    {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                    {action.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
});

RowActionsMenu.displayName = 'RowActionsMenu';

// FIXED: Simplified Table Pagination to avoid breaking changes
const TablePagination = memo(({ pagination, onPageChange, onPageSizeChange }) => {
  const { currentPage, totalPages, pageSize, totalItems, pageSizeOptions = [10, 20, 50, 100] } = pagination;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="px-6 py-4 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        {/* Results info */}
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </p>
          
          {/* Page size selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">Show:</label>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              className="border border-gray-300 rounded-md text-sm py-1 px-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pagination buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {getPageNumbers().map(page => (
            <button
              key={page}
              onClick={() => onPageChange?.(page)}
              className={classNames(
                'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                {
                  'bg-primary-600 text-white': page === currentPage,
                  'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50': page !== currentPage,
                }
              )}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
});

TablePagination.displayName = 'TablePagination';

export default DataTable;