import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';
import classNames from 'classnames';

/**
 * Enhanced Confirmation Modal with Impact Analysis
 * NEW FILE: src/components/common/EnhancedConfirmModal.jsx
 * 
 * Features:
 * - Rich confirmation dialogs with impact preview
 * - Cascading effects display
 * - Mandatory reason collection
 * - Understanding acknowledgment
 * - Visual impact analysis
 */
const EnhancedConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning', // 'warning' | 'danger' | 'info' | 'success'
  items = [],
  cascadingEffects = [],
  requiresReason = false,
  showImpactAnalysis = false,
  loading = false,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  const [reason, setReason] = useState('');
  const [understood, setUnderstood] = useState(false);

  const handleConfirm = () => {
    if (requiresReason && !reason.trim()) {
      return; // Don't proceed without reason
    }
    if (showImpactAnalysis && !understood) {
      return; // Don't proceed without understanding
    }
    
    onConfirm({ 
      reason: reason.trim(), 
      understood,
      itemCount: items.length 
    });
  };

  const handleClose = () => {
    if (!loading) {
      setReason('');
      setUnderstood(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  const getIcon = () => {
    const iconClass = "h-8 w-8";
    
    switch (type) {
      case 'danger':
        return <XCircleIcon className={`${iconClass} text-red-600`} />;
      case 'success':
        return <CheckCircleIcon className={`${iconClass} text-green-600`} />;
      case 'info':
        return <InformationCircleIcon className={`${iconClass} text-blue-600`} />;
      case 'warning':
      default:
        return <ExclamationTriangleIcon className={`${iconClass} text-yellow-600`} />;
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case 'danger':
        return 'btn-danger';
      case 'success':
        return 'btn-success';
      case 'info':
        return 'btn-primary';
      case 'warning':
      default:
        return 'btn-warning';
    }
  };

  const isFormValid = () => {
    if (requiresReason && !reason.trim()) return false;
    if (showImpactAnalysis && !understood) return false;
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        />
        
        {/* Modal */}
        <div className="inline-block w-full max-w-2xl overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getIcon()}
                <h3 className="ml-3 text-lg font-medium text-gray-900">{title}</h3>
              </div>
              <button
                onClick={handleClose}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-4 max-h-96 overflow-y-auto">
            {/* Main message */}
            <p className="text-sm text-gray-600">{message}</p>

            {/* Items being affected */}
            {items.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Items to be affected ({items.length}):
                </h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {items.slice(0, 10).map((item, index) => (
                    <div key={index} className="text-sm text-gray-700 flex items-center">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-2 flex-shrink-0"></div>
                      <span className="truncate">
                        {item.name || item.title || item.email || item.first_name || `Item ${item.id}`}
                      </span>
                    </div>
                  ))}
                  {items.length > 10 && (
                    <div className="text-sm text-gray-500 italic">
                      ...and {items.length - 10} more items
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cascading Effects Warning */}
            {cascadingEffects.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-yellow-800 mb-2 flex items-center">
                  <ShieldExclamationIcon className="h-4 w-4 mr-1" />
                  This action will also affect:
                </h4>
                <ul className="space-y-1">
                  {cascadingEffects.map((effect, index) => (
                    <li key={index} className="text-sm text-yellow-700 flex items-start">
                      <span className="text-yellow-500 mr-2 flex-shrink-0">•</span>
                      <span>{effect}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reason Input */}
            {requiresReason && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for this action *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please explain why you're performing this action..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  disabled={loading}
                />
                {requiresReason && !reason.trim() && (
                  <p className="mt-1 text-sm text-red-600">Reason is required</p>
                )}
              </div>
            )}

            {/* Understanding Checkbox */}
            {showImpactAnalysis && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    checked={understood}
                    onChange={(e) => setUnderstood(e.target.checked)}
                    disabled={loading}
                    className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-red-800">
                    <span className="font-medium">I understand the consequences</span> of this action and want to proceed. 
                    This may affect other parts of the system and cannot be easily undone.
                  </label>
                </div>
                {showImpactAnalysis && !understood && (
                  <p className="mt-2 text-sm text-red-600">You must acknowledge the impact to proceed</p>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="btn btn-outline"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading || !isFormValid()}
              className={classNames('btn', getButtonClass())}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedConfirmModal;