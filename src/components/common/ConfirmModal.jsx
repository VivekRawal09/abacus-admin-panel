import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { ButtonLoader } from './LoadingSpinner';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // warning, danger, info, success
  isLoading = false,
  disabled = false,
  children,
}) => {
  const getIcon = () => {
    const iconClass = "h-6 w-6";
    
    switch (type) {
      case 'danger':
        return <XCircleIcon className={`${iconClass} text-danger-600`} />;
      case 'success':
        return <CheckCircleIcon className={`${iconClass} text-success-600`} />;
      case 'info':
        return <InformationCircleIcon className={`${iconClass} text-primary-600`} />;
      case 'warning':
      default:
        return <ExclamationTriangleIcon className={`${iconClass} text-warning-600`} />;
    }
  };

  const getIconBgColor = () => {
    switch (type) {
      case 'danger':
        return 'bg-danger-100';
      case 'success':
        return 'bg-success-100';
      case 'info':
        return 'bg-primary-100';
      case 'warning':
      default:
        return 'bg-warning-100';
    }
  };

  const getConfirmButtonClass = () => {
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

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-start">
                  <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${getIconBgColor()} sm:mx-0 sm:h-10 sm:w-10`}>
                    {getIcon()}
                  </div>
                  <div className="mt-0 ml-4 text-left flex-1">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {title}
                    </Dialog.Title>
                    <div className="mt-2">
                      {children ? (
                        children
                      ) : (
                        <p className="text-sm text-gray-500">
                          {message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    {cancelText}
                  </button>
                  <button
                    type="button"
                    className={`btn ${getConfirmButtonClass()}`}
                    onClick={handleConfirm}
                    disabled={disabled || isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <ButtonLoader size="small" />
                        <span className="ml-2">Processing...</span>
                      </div>
                    ) : (
                      confirmText
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

// Specialized confirm modals
export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType = 'item',
  isLoading = false,
  additionalWarning = null,
}) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={`Delete ${itemType}`}
      type="danger"
      confirmText="Delete"
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <div className="space-y-3">
        <p className="text-sm text-gray-500">
          Are you sure you want to delete{' '}
          <span className="font-medium text-gray-900">"{itemName}"</span>?
        </p>
        <p className="text-sm text-danger-600 font-medium">
          This action cannot be undone.
        </p>
        {additionalWarning && (
          <div className="bg-danger-50 border border-danger-200 rounded-md p-3">
            <p className="text-sm text-danger-700">
              {additionalWarning}
            </p>
          </div>
        )}
      </div>
    </ConfirmModal>
  );
};

export const BulkDeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  count,
  itemType = 'items',
  isLoading = false,
}) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={`Delete ${count} ${itemType}`}
      type="danger"
      confirmText={`Delete ${count} ${itemType}`}
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <div className="space-y-3">
        <p className="text-sm text-gray-500">
          Are you sure you want to delete{' '}
          <span className="font-medium text-gray-900">{count} selected {itemType}</span>?
        </p>
        <p className="text-sm text-danger-600 font-medium">
          This action cannot be undone and will permanently remove all selected items.
        </p>
      </div>
    </ConfirmModal>
  );
};

export const StatusChangeConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  currentStatus,
  newStatus,
  isLoading = false,
}) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'text-success-600';
      case 'inactive':
        return 'text-gray-600';
      case 'suspended':
        return 'text-danger-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Change Status"
      type="info"
      confirmText="Change Status"
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <div className="space-y-3">
        <p className="text-sm text-gray-500">
          Are you sure you want to change the status of{' '}
          <span className="font-medium text-gray-900">"{itemName}"</span>?
        </p>
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-500">From:</span>
          <span className={`font-medium ${getStatusColor(currentStatus)}`}>
            {currentStatus}
          </span>
          <span className="text-gray-400">→</span>
          <span className={`font-medium ${getStatusColor(newStatus)}`}>
            {newStatus}
          </span>
        </div>
      </div>
    </ConfirmModal>
  );
};

export const SaveChangesConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  hasUnsavedChanges = true,
  isLoading = false,
}) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Unsaved Changes"
      type="warning"
      confirmText="Save Changes"
      cancelText="Discard"
      isLoading={isLoading}
    >
      <div className="space-y-3">
        <p className="text-sm text-gray-500">
          You have unsaved changes that will be lost if you continue.
        </p>
        <p className="text-sm text-gray-700 font-medium">
          Would you like to save your changes before continuing?
        </p>
      </div>
    </ConfirmModal>
  );
};

export const LogoutConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Sign Out"
      type="info"
      confirmText="Sign Out"
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <p className="text-sm text-gray-500">
        Are you sure you want to sign out of your account?
      </p>
    </ConfirmModal>
  );
};

// Hook for managing confirm modal state
export const useConfirmModal = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [config, setConfig] = React.useState({});

  const openModal = (modalConfig = {}) => {
    setConfig(modalConfig);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setConfig({});
  };

  const confirmModal = (modalConfig) => {
    return new Promise((resolve) => {
      openModal({
        ...modalConfig,
        onConfirm: () => {
          closeModal();
          resolve(true);
        },
        onClose: () => {
          closeModal();
          resolve(false);
        },
      });
    });
  };

  return {
    isOpen,
    config,
    openModal,
    closeModal,
    confirmModal,
  };
};

export default ConfirmModal;