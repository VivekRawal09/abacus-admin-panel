import React, { useState } from 'react';
import classNames from 'classnames';
import EnhancedConfirmModal from './EnhancedConfirmModal';
import toast from 'react-hot-toast';

/**
 * Enhanced Status Toggle Component
 * NEW FILE: src/components/common/EnhancedStatusToggle.jsx
 * 
 * Features:
 * - Smart status toggle with confirmations
 * - Optimistic updates with rollback
 * - Loading states and visual feedback
 * - Context-aware messaging
 */
const EnhancedStatusToggle = ({ 
  item, 
  currentStatus, 
  onStatusChange,
  disabled = false,
  entityType = 'item',
  requiresReason = true,
  size = 'sm' // 'sm' | 'md' | 'lg'
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [optimisticStatus, setOptimisticStatus] = useState(currentStatus);

  const isActive = optimisticStatus === 'active' || optimisticStatus === true;
  const newStatus = !isActive;

  const handleToggle = () => {
    if (requiresReason || entityType === 'user') {
      setShowConfirm(true);
    } else {
      performStatusChange({});
    }
  };

  const performStatusChange = async ({ reason }) => {
    setLoading(true);
    
    // Optimistic update
    const originalStatus = optimisticStatus;
    setOptimisticStatus(newStatus ? 'active' : 'inactive');
    
    try {
      await onStatusChange(item.id, newStatus, reason);
      setShowConfirm(false);
      
      // Success feedback
      toast.success(`${entityType} ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      // Rollback optimistic update
      setOptimisticStatus(originalStatus);
      
      // Error feedback
      toast.error(`Failed to ${newStatus ? 'activate' : 'deactivate'} ${entityType}`);
      console.error('Status change failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusMessage = () => {
    const itemName = item.name || item.title || item.email || item.first_name || `${entityType} #${item.id}`;
    
    if (entityType === 'user') {
      return isActive 
        ? `This will deactivate "${itemName}" and prevent login access. All active sessions will be terminated.`
        : `This will reactivate "${itemName}" and restore login access.`;
    }
    
    if (entityType === 'video') {
      return isActive 
        ? `This will deactivate "${itemName}" and hide it from students. Progress data will be preserved.`
        : `This will reactivate "${itemName}" and make it visible to students again.`;
    }
    
    if (entityType === 'institute') {
      return isActive 
        ? `This will deactivate "${itemName}" and suspend all related activities.`
        : `This will reactivate "${itemName}" and resume all activities.`;
    }
    
    return isActive 
      ? `This will deactivate "${itemName}" and hide it from active listings.`
      : `This will reactivate "${itemName}" and make it visible again.`;
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'lg':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-2.5 py-1 text-sm';
      case 'sm':
      default:
        return 'px-2.5 py-0.5 text-xs';
    }
  };

  return (
    <>
      <button
        onClick={handleToggle}
        disabled={disabled || loading}
        className={classNames(
          'inline-flex items-center rounded-full font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          getSizeClasses(),
          {
            'bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-500': isActive,
            'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500': !isActive,
            'opacity-50 cursor-not-allowed': disabled || loading,
            'cursor-pointer': !disabled && !loading
          }
        )}
        title={`Click to ${newStatus ? 'activate' : 'deactivate'}`}
      >
        {loading ? (
          <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-1"></div>
        ) : (
          <div className={classNames(
            'rounded-full mr-1',
            size === 'lg' ? 'w-2.5 h-2.5' : 'w-2 h-2',
            isActive ? 'bg-green-500' : 'bg-gray-400'
          )}></div>
        )}
        {isActive ? 'Active' : 'Inactive'}
      </button>

      <EnhancedConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={performStatusChange}
        title={`${newStatus ? 'Activate' : 'Deactivate'} ${entityType}`}
        message={getStatusMessage()}
        type={newStatus ? 'info' : 'warning'}
        items={[item]}
        requiresReason={requiresReason}
        confirmText={newStatus ? 'Activate' : 'Deactivate'}
        loading={loading}
      />
    </>
  );
};

export default EnhancedStatusToggle;