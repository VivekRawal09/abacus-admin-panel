import React, { useState, useEffect } from 'react';
import { ArrowUturnLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

/**
 * Soft Delete with Undo Component
 * NEW FILE: src/components/common/SoftDeleteWithUndo.jsx
 * 
 * Features:
 * - 30-second undo window
 * - Real-time countdown display
 * - Graceful cancellation
 * - Toast notifications with actions
 */

// Undo Toast Component
const UndoToast = ({ message, onUndo, countdown, onDismiss }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 text-white rounded-lg shadow-lg max-w-md">
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
        <p className="text-xs text-gray-300">Auto-confirm in {countdown}s</p>
      </div>
      <div className="flex space-x-2 ml-4">
        <button
          onClick={onUndo}
          className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded text-white font-medium transition-colors"
        >
          <ArrowUturnLeftIcon className="h-4 w-4 inline mr-1" />
          Undo
        </button>
        <button
          onClick={onDismiss}
          className="px-2 py-1 text-sm text-gray-300 hover:text-white transition-colors"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Custom hook for soft delete with undo
export const useSoftDeleteWithUndo = (entityType, deleteService, undoTimeLimit = 30) => {
  const [pendingDeletes, setPendingDeletes] = useState(new Map());

  const performSoftDelete = async (itemId, reason, itemName) => {
    const deleteId = `${entityType}_${itemId}_${Date.now()}`;
    
    // Add to pending deletes
    setPendingDeletes(prev => new Map(prev).set(deleteId, {
      itemId,
      reason,
      itemName,
      timestamp: Date.now(),
      entityType
    }));

    // Show undo toast
    let countdown = undoTimeLimit;
    let intervalId;
    
    const toastId = toast.custom(
      (t) => (
        <UndoToast
          message={`"${itemName}" will be deleted`}
          countdown={countdown}
          onUndo={() => {
            clearInterval(intervalId);
            setPendingDeletes(prev => {
              const newMap = new Map(prev);
              newMap.delete(deleteId);
              return newMap;
            });
            toast.dismiss(toastId);
            toast.success('Delete cancelled');
          }}
          onDismiss={() => {
            clearInterval(intervalId);
            toast.dismiss(toastId);
          }}
        />
      ),
      {
        duration: undoTimeLimit * 1000,
        position: 'bottom-right'
      }
    );

    // Countdown timer
    intervalId = setInterval(() => {
      countdown -= 1;
      if (countdown <= 0) {
        clearInterval(intervalId);
        // Perform actual delete
        performActualDelete(deleteId, itemId, reason);
      }
    }, 1000);

    return deleteId;
  };

  const performActualDelete = async (deleteId, itemId, reason) => {
    try {
      await deleteService(itemId, reason);
      
      // Remove from pending deletes
      setPendingDeletes(prev => {
        const newMap = new Map(prev);
        newMap.delete(deleteId);
        return newMap;
      });
      
      toast.success('Item deleted successfully');
    } catch (error) {
      console.error('Final delete failed:', error);
      toast.error('Delete failed: ' + error.message);
      
      // Remove from pending anyway
      setPendingDeletes(prev => {
        const newMap = new Map(prev);
        newMap.delete(deleteId);
        return newMap;
      });
    }
  };

  const cancelDelete = (deleteId) => {
    setPendingDeletes(prev => {
      const newMap = new Map(prev);
      newMap.delete(deleteId);
      return newMap;
    });
  };

  return {
    performSoftDelete,
    pendingDeletes,
    cancelDelete,
    hasPendingDeletes: pendingDeletes.size > 0
  };
};

// Progress Toast for Bulk Operations
export const BulkProgressToast = ({ 
  message, 
  progress, 
  total, 
  onCancel,
  canCancel = false 
}) => {
  const percentage = total > 0 ? Math.round((progress / total) * 100) : 0;
  
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-lg max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-900">{message}</p>
        {canCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <div className="mb-2">
        <div className="bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      
      <p className="text-xs text-gray-500">
        {progress} of {total} completed ({percentage}%)
      </p>
    </div>
  );
};

// Hook for bulk operations with progress
export const useBulkOperationWithProgress = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [cancelled, setCancelled] = useState(false);

  const startBulkOperation = async (items, operation, batchSize = 5) => {
    setIsRunning(true);
    setProgress(0);
    setTotal(items.length);
    setCancelled(false);

    let toastId;
    
    try {
      // Show progress toast
      toastId = toast.custom(
        (t) => (
          <BulkProgressToast
            message="Processing items..."
            progress={progress}
            total={total}
            onCancel={() => {
              setCancelled(true);
              toast.dismiss(toastId);
            }}
            canCancel={true}
          />
        ),
        {
          duration: Infinity,
          position: 'bottom-right'
        }
      );

      // Process in batches
      for (let i = 0; i < items.length; i += batchSize) {
        if (cancelled) break;
        
        const batch = items.slice(i, i + batchSize);
        
        await Promise.all(
          batch.map(async (item) => {
            if (!cancelled) {
              try {
                await operation(item);
                setProgress(prev => prev + 1);
              } catch (error) {
                console.error('Batch item failed:', error);
                setProgress(prev => prev + 1); // Still count as processed
              }
            }
          })
        );
      }

      toast.dismiss(toastId);
      
      if (!cancelled) {
        toast.success(`Successfully processed ${progress} items`);
      }
      
    } catch (error) {
      console.error('Bulk operation failed:', error);
      toast.dismiss(toastId);
      toast.error('Bulk operation failed: ' + error.message);
    } finally {
      setIsRunning(false);
      setProgress(0);
      setTotal(0);
      setCancelled(false);
    }
  };

  return {
    startBulkOperation,
    isRunning,
    progress,
    total,
    cancelled
  };
};

export default {
  UndoToast,
  useSoftDeleteWithUndo,
  BulkProgressToast,
  useBulkOperationWithProgress
};