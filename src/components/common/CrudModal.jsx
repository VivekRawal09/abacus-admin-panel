import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import classNames from 'classnames';

/**
 * Reusable CRUD Modal Component
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {function} props.onClose - Close modal callback
 * @param {function} props.onSubmit - Submit form callback
 * @param {string} props.title - Modal title
 * @param {string} props.mode - 'create' | 'edit' | 'view'
 * @param {Object} props.initialData - Initial form data for edit mode
 * @param {Array} props.fields - Form field configuration
 * @param {boolean} props.loading - Loading state
 * @param {string} props.submitText - Submit button text
 * @param {string} props.size - 'sm' | 'md' | 'lg' | 'xl'
 */
const CrudModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  mode = 'create',
  initialData = {},
  fields = [],
  loading = false,
  submitText,
  size = 'lg'
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // Initialize form data
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData(initialData);
      } else {
        // Initialize with default values from field definitions
        const defaultData = {};
        fields.forEach(field => {
          if (field.defaultValue !== undefined) {
            defaultData[field.name] = field.defaultValue;
          } else {
            defaultData[field.name] = '';
          }
        });
        setFormData(defaultData);
      }
      setErrors({});
    }
  }, [isOpen, mode, initialData, fields]);

  // Handle input changes
  const handleChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    fields.forEach(field => {
      if (field.required && (!formData[field.name] || formData[field.name].toString().trim() === '')) {
        newErrors[field.name] = `${field.label} is required`;
      }
      
      // Custom validation
      if (field.validation && formData[field.name]) {
        const validationResult = field.validation(formData[field.name], formData);
        if (validationResult !== true) {
          newErrors[field.name] = validationResult;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!loading) {
      setFormData({});
      setErrors({});
      onClose();
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  const isReadOnly = mode === 'view';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className={classNames(
          'inline-block w-full overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle',
          sizeClasses[size]
        )}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {title}
            </h3>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map((field) => (
                  <div 
                    key={field.name} 
                    className={field.fullWidth ? 'md:col-span-2' : ''}
                  >
                    <FormField
                      field={field}
                      value={formData[field.name] || ''}
                      onChange={(value) => handleChange(field.name, value)}
                      error={errors[field.name]}
                      disabled={loading || isReadOnly}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            {!isReadOnly && (
              <div className="flex justify-end px-6 py-4 space-x-3 border-t border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {mode === 'create' ? 'Creating...' : 'Updating...'}
                    </div>
                  ) : (
                    submitText || (mode === 'create' ? 'Create' : 'Update')
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

/**
 * Individual Form Field Component
 */
const FormField = ({ field, value, onChange, error, disabled }) => {
  const baseInputClasses = classNames(
    'form-input',
    error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '',
    disabled ? 'bg-gray-50 cursor-not-allowed' : ''
  );

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
      case 'number':
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            className={baseInputClasses}
            min={field.min}
            max={field.max}
            step={field.step}
          />
        );

      case 'password':
        return (
          <input
            type="password"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            className={baseInputClasses}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            rows={field.rows || 3}
            className={classNames(
              'form-textarea',
              error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '',
              disabled ? 'bg-gray-50 cursor-not-allowed' : ''
            )}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={classNames(
              'form-select',
              error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '',
              disabled ? 'bg-gray-50 cursor-not-allowed' : ''
            )}
          >
            {field.placeholder && (
              <option value="">{field.placeholder}</option>
            )}
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => onChange(e.target.checked)}
              disabled={disabled}
              className={classNames(
                'form-checkbox',
                disabled ? 'cursor-not-allowed' : ''
              )}
            />
            <span className="ml-2 text-sm text-gray-600">
              {field.checkboxLabel || field.label}
            </span>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  disabled={disabled}
                  className={classNames(
                    'form-radio',
                    disabled ? 'cursor-not-allowed' : ''
                  )}
                />
                <span className="ml-2 text-sm text-gray-700">
                  {option.label}
                </span>
              </div>
            ))}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={baseInputClasses}
          />
        );

      case 'datetime-local':
        return (
          <input
            type="datetime-local"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={baseInputClasses}
          />
        );

      case 'file':
        return (
          <input
            type="file"
            onChange={(e) => onChange(e.target.files[0])}
            disabled={disabled}
            accept={field.accept}
            className={classNames(
              'form-input',
              disabled ? 'cursor-not-allowed' : ''
            )}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            className={baseInputClasses}
          />
        );
    }
  };

  return (
    <div>
      {field.type !== 'checkbox' && (
        <label className="form-label">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {renderField()}
      
      {field.helpText && (
        <p className="mt-1 text-sm text-gray-500">{field.helpText}</p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default CrudModal;