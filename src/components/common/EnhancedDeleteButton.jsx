import React, { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import EnhancedConfirmModal from './EnhancedConfirmModal';
import toast from 'react-hot-toast';

/**
 * Enhanced Delete Button Component
 * NEW FILE: src/components/common/EnhancedDeleteButton.jsx
 * 
 * Features:
 * - Rich delete confirmations with impact analysis
 * - Cascading effects preview
 * - Different variants (icon/button)
 * - Context-aware messaging
 */
const EnhancedDeleteButton = ({ 
  item, 
  onDelete, 
  entityType = 'item',
  cascadingEffects = [],
  disabled = false,
  size = 'sm', // 'sm' | 'md' | 'lg'
  variant = 'icon', // 'icon' | 'button'
  className = '',
  children
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const performDelete = async ({ reason }) => {
    setLoading(true);
    
    try {
      await onDelete(item.id, reason);
      setShowConfirm(false);
      
      // Success feedback
      const itemName = item.name || item.title || item.email || item.first_name || `${entityType} #${item.id}`;
      toast.success(`"${itemName}" deleted successfully`);
      
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error(`Failed to delete ${entityType}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getDeletionMessage = () => {
    const itemName = item.name || item.title || item.email || item.first_name || `${entityType} #${item.id}`;
    
    if (entityType === 'user') {
      return `Are you sure you want to delete "${itemName}"? This will permanently remove the user account and cannot be undone.`;
    }
    
    if (entityType === 'video') {
      return `Are you sure you want to delete "${itemName}"? This will remove the video from all courses and student progress will be archived.`;
    }
    
    if (entityType === 'institute') {
      return `Are you sure you want to delete "${itemName}"? This will affect all users and data associated with this institute.`;
    }
    
    return `Are you sure you want to delete "${itemName}"? This action cannot be undone.`;
  };

  const getIconSize = () => {
    switch (size) {
      case 'lg': return 'h-6 w-6';
      case 'md': return 'h-5 w-5';
      case 'sm': 
      default: return 'h-4 w-4';
    }
  };

  // Button variant
  if (variant === 'button') {
    return (
      <>
        <button
          onClick={handleDelete}
          disabled={disabled || loading}
          className={classNames(
            'btn btn-danger',
            size === 'lg' ? 'btn-lg' : size === 'md' ? 'btn-md' : 'btn-sm',
            className,
            {
              'opacity-50 cursor-not-allowed': disabled || loading
            }
          )}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Deleting...
            </div>
          ) : (
            <>
              <TrashIcon className={classNames(getIconSize(), 'mr-1')} />
              {children || 'Delete'}
            </>
          )}
        </button>

        <EnhancedConfirmModal
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={performDelete}
          title={`Delete ${entityType}`}
          message={getDeletionMessage()}
          type="danger"
          items={[item]}
          cascadingEffects={cascadingEffects}
          requiresReason={true}
          showImpactAnalysis={cascadingEffects.length > 0}
          confirmText="Delete"
          loading={loading}
        />
      </>
    );
  }

  // Icon variant (default)
  return (
    <>
      <button
        onClick={handleDelete}
        disabled={disabled || loading}
        className={classNames(
          'p-1 rounded text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1',
          className,
          {
            'opacity-50 cursor-not-allowed': disabled || loading,
            'cursor-pointer': !disabled && !loading
          }
        )}
        title={`Delete ${entityType}`}
      >
        {loading ? (
          <div className={classNames(
            'border-2 border-red-600 border-t-transparent rounded-full animate-spin',
            getIconSize()
          )}></div>
        ) : (
          <TrashIcon className={getIconSize()} />
        )}
      </button>

      <EnhancedConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={performDelete}
        title={`Delete ${entityType}`}
        message={getDeletionMessage()}
        type="danger"
        items={[item]}
        cascadingEffects={cascadingEffects}
        requiresReason={true}
        showImpactAnalysis={cascadingEffects.length > 0}
        confirmText="Delete"
        loading={loading}
      />
    </>
  );
};

export default EnhancedDeleteButton;