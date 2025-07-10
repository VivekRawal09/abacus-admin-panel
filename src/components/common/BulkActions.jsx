import React, { useState } from 'react';
import { 
  TrashIcon, 
  PencilIcon, 
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';
import ConfirmModal from './ConfirmModal';
import toast from 'react-hot-toast';
import classNames from 'classnames';

/**
 * Reusable Bulk Actions Component
 * 
 * @param {Object} props
 * @param {Array} props.selectedItems - Array of selected item IDs
 * @param {function} props.onClearSelection - Clear selection callback
 * @param {Array} props.actions - Array of bulk action configurations
 * @param {string} props.itemName - Name of items for messaging (e.g., "users", "videos")
 * @param {boolean} props.loading - Loading state
 */
const BulkActions = ({
  selectedItems = [],
  onClearSelection,
  actions = [],
  itemName = 'items',
  loading = false
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // Don't show if no items selected
  if (selectedItems.length === 0) return null;

  // Handle action click
  const handleActionClick = (action) => {
    setShowDropdown(false);

    if (action.requiresConfirmation) {
      setConfirmAction(action);
    } else {
      executeAction(action);
    }
  };

  // Execute the action
  const executeAction = async (action) => {
    try {
      await action.handler(selectedItems);
      if (action.clearSelectionAfter !== false) {
        onClearSelection();
      }
    } catch (error) {
      console.error(`Bulk ${action.label} error:`, error);
      toast.error(`Failed to ${action.label.toLowerCase()}: ${error.message}`);
    }
  };

  // Default bulk actions
  const defaultActions = [
    {
      id: 'activate',
      label: 'Activate',
      icon: CheckCircleIcon,
      variant: 'success',
      requiresConfirmation: true,
      confirmTitle: `Activate ${itemName}`,
      confirmMessage: `Are you sure you want to activate ${selectedItems.length} selected ${itemName}?`,
    },
    {
      id: 'deactivate',
      label: 'Deactivate',
      icon: XCircleIcon,
      variant: 'warning',
      requiresConfirmation: true,
      confirmTitle: `Deactivate ${itemName}`,
      confirmMessage: `Are you sure you want to deactivate ${selectedItems.length} selected ${itemName}?`,
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: TrashIcon,
      variant: 'danger',
      requiresConfirmation: true,
      confirmTitle: `Delete ${itemName}`,
      confirmMessage: `Are you sure you want to delete ${selectedItems.length} selected ${itemName}? This action cannot be undone.`,
    },
    {
      id: 'export',
      label: 'Export',
      icon: ArrowDownTrayIcon,
      variant: 'default',
      requiresConfirmation: false,
    },
  ];

  // Merge default actions with custom actions
  const allActions = [...actions, ...defaultActions.filter(defaultAction => 
    !actions.some(action => action.id === defaultAction.id)
  )];

  // Get primary actions (first 2-3 actions)
  const primaryActions = allActions.slice(0, 2);
  const secondaryActions = allActions.slice(2);

  return (
    <>
      {/* Bulk Actions Bar */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-3 flex items-center space-x-4">
          {/* Selection Count */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900">
              {selectedItems.length} {itemName} selected
            </span>
            <button
              onClick={onClearSelection}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
              disabled={loading}
            >
              Clear
            </button>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-300" />

          {/* Primary Actions */}
          <div className="flex items-center space-x-2">
            {primaryActions.map((action) => (
              <BulkActionButton
                key={action.id}
                action={action}
                onClick={() => handleActionClick(action)}
                disabled={loading}
              />
            ))}

            {/* More Actions Dropdown */}
            {secondaryActions.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  disabled={loading}
                  className="btn btn-outline btn-sm"
                >
                  <EllipsisHorizontalIcon className="h-4 w-4" />
                </button>

                {showDropdown && (
                  <div className="absolute bottom-full mb-2 right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {secondaryActions.map((action) => (
                      <button
                        key={action.id}
                        onClick={() => handleActionClick(action)}
                        disabled={loading}
                        className={classNames(
                          'w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2',
                          action.variant === 'danger' ? 'text-red-600 hover:bg-red-50' :
                          action.variant === 'warning' ? 'text-yellow-600 hover:bg-yellow-50' :
                          action.variant === 'success' ? 'text-green-600 hover:bg-green-50' :
                          'text-gray-700'
                        )}
                      >
                        <action.icon className="h-4 w-4" />
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setConfirmAction(null)}
          onConfirm={() => {
            executeAction(confirmAction);
            setConfirmAction(null);
          }}
          title={confirmAction.confirmTitle || `${confirmAction.label} ${itemName}`}
          message={confirmAction.confirmMessage || `Are you sure you want to ${confirmAction.label.toLowerCase()} ${selectedItems.length} selected ${itemName}?`}
          confirmText={confirmAction.label}
          variant={confirmAction.variant || 'default'}
          loading={loading}
        />
      )}

      {/* Click outside handler for dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </>
  );
};

/**
 * Individual Bulk Action Button
 */
const BulkActionButton = ({ action, onClick, disabled }) => {
  const variantClasses = {
    danger: 'btn-danger',
    warning: 'btn-warning',
    success: 'btn-success',
    primary: 'btn-primary',
    default: 'btn-outline'
  };

  const buttonClass = variantClasses[action.variant] || variantClasses.default;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classNames('btn btn-sm', buttonClass)}
      title={action.tooltip || action.label}
    >
      {action.icon && <action.icon className="h-4 w-4 mr-1" />}
      {action.label}
    </button>
  );
};

export default BulkActions;