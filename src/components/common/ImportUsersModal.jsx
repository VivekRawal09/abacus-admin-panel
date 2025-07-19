import React, { useState, useEffect } from 'react';
import { XMarkIcon, CloudArrowUpIcon, DocumentTextIcon, ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import classNames from 'classnames';

/**
 * Import Users Modal Component - UPDATED FOR EXCEL FILES
 */
const ImportUsersModal = ({
  isOpen,
  onClose,
  onImport,
  loading = false
}) => {
  const [file, setFile] = useState(null);
  const [importOptions, setImportOptions] = useState({
    overwrite: false,
    validateOnly: false
  });
  const [dragActive, setDragActive] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [isImporting, setIsImporting] = useState(false);

  // Handle file selection - UPDATED FOR EXCEL
  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    // FIXED: Validate Excel file type instead of CSV
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/octet-stream' // sometimes Excel files come as this
    ];
    
    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'));
    
    if (!validTypes.includes(selectedFile.type) && !validExtensions.includes(fileExtension)) {
      toast.error('Please select a valid Excel file (.xlsx or .xls)');
      return;
    }

    // Validate file size (max 10MB for Excel files)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setImportResult(null);
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Handle form submission - UPDATED FOR NEW RESPONSE FORMAT
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select an Excel file');
      return;
    }

    setIsImporting(true);
    setImportResult(null);

    try {
      console.log('🚀 Starting import process...');
      const result = await onImport(file, importOptions);
      
      console.log('📊 Import result:', result);
      setImportResult(result);
      
      if (result.success) {
        // Auto-close modal after successful import (with delay to show success message)
        setTimeout(() => {
          resetModal();
        }, 3000);
      }
    } catch (error) {
      console.error('❌ Import error in modal:', error);
      setImportResult({
        success: false,
        error: error.message || 'Import failed',
        details: 'Please check your file format and try again'
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Reset modal state
  const resetModal = () => {
    setFile(null);
    setImportResult(null);
    setImportOptions({
      overwrite: false,
      validateOnly: false
    });
  };

  // Handle modal close
  const handleClose = (e) => {
    e?.stopPropagation();
    if (!isImporting) {
      resetModal();
      onClose();
    }
  };

  // Handle background click
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget && !isImporting) {
      handleClose(e);
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !isImporting) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, isImporting]);

  // Don't render if not open
  if (!isOpen) return null;

  // Download sample Excel function - UPDATED FOR EXCEL FORMAT
  const downloadSampleExcel = () => {
    // Create sample data for Excel template
    const sampleData = [
      'first_name,last_name,email,password,role,phone,institute_id,zone_id,status,date_of_birth,gender,address',
      'John,Doe,john.doe@abacus.edu,temp123,student,9876543119,1,1,active,2010-03-15,male,123 MG Road Bangalore',
      'Jane,Smith,jane.smith@abacus.edu,temp123,teacher,9876543120,1,1,active,1985-07-22,female,456 FC Road Pune',
      'Mike,Johnson,mike.johnson@abacus.edu,temp123,parent,9876543121,2,1,active,1975-11-25,male,789 Park Street Kolkata'
    ].join('\n');
    
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'users_sample_template.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    toast.success('Sample template downloaded! Convert to Excel format before uploading.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
        onClick={handleBackgroundClick}
      >
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />

        {/* Modal */}
        <div 
          className="inline-block w-full max-w-4xl overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle relative z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <CloudArrowUpIcon className="h-6 w-6 mr-2 text-primary-600" />
              Import Users from Excel
            </h3>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
              disabled={isImporting}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 space-y-6 max-h-96 overflow-y-auto">
              {/* Instructions - UPDATED FOR EXCEL */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Excel Format Requirements:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>File format:</strong> Excel (.xlsx or .xls)</li>
                  <li>• <strong>Required columns:</strong> email, password</li>
                  <li>• <strong>Optional columns:</strong> first_name, last_name, role, phone, institute_id, zone_id, status, date_of_birth, gender, address</li>
                  <li>• <strong>Role values:</strong> student, teacher, parent, institute_admin, zone_manager, super_admin</li>
                  <li>• <strong>Date format:</strong> YYYY-MM-DD (e.g., 2010-03-15)</li>
                  <li>• <strong>File size:</strong> Maximum 10MB</li>
                </ul>
              </div>

              {/* File Upload Area - UPDATED FOR EXCEL */}
              <div
                className={classNames(
                  'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                  dragActive ? 'border-primary-400 bg-primary-50' : 'border-gray-300',
                  file ? 'bg-green-50 border-green-300' : ''
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <div>
                    <DocumentTextIcon className="mx-auto h-12 w-12 text-green-600" />
                    <p className="mt-2 text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setImportResult(null);
                      }}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                      disabled={isImporting}
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      <span className="font-medium text-primary-600 hover:text-primary-500">
                        Click to upload
                      </span>
                      {' '}or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">Excel files only (.xlsx, .xls), up to 10MB</p>
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={(e) => handleFileSelect(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isImporting}
                    />
                  </div>
                )}
              </div>

              {/* Import Result Display - NEW */}
              {importResult && (
                <div className={classNames(
                  'rounded-lg border p-4',
                  importResult.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                )}>
                  <div className="flex items-start">
                    {importResult.success ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                    ) : (
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h4 className={classNames(
                        'font-medium',
                        importResult.success ? 'text-green-800' : 'text-red-800'
                      )}>
                        {importResult.success ? 'Import Successful!' : 'Import Failed'}
                      </h4>
                      <div className={classNames(
                        'mt-1 text-sm',
                        importResult.success ? 'text-green-700' : 'text-red-700'
                      )}>
                        {importResult.message || importResult.error}
                      </div>
                      
                      {/* Success Details */}
                      {importResult.success && (
                        <div className="mt-2 text-sm text-green-600 space-y-1">
                          <div>✅ {importResult.imported || 0} users imported successfully</div>
                          {importResult.skipped > 0 && (
                            <div>⚠️ {importResult.skipped} rows had errors and were skipped</div>
                          )}
                          {importResult.totalProcessed && (
                            <div>📊 Total rows processed: {importResult.totalProcessed}</div>
                          )}
                        </div>
                      )}

                      {/* Warnings */}
                      {importResult.warnings && importResult.warnings.length > 0 && (
                        <div className="mt-2 text-sm text-yellow-700">
                          <div className="font-medium">Warnings:</div>
                          <ul className="list-disc list-inside mt-1">
                            {importResult.warnings.slice(0, 5).map((warning, index) => (
                              <li key={index}>{warning}</li>
                            ))}
                            {importResult.warnings.length > 5 && (
                              <li>... and {importResult.warnings.length - 5} more</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Import Options - SIMPLIFIED */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={importOptions.overwrite}
                      onChange={(e) => setImportOptions(prev => ({ ...prev, overwrite: e.target.checked }))}
                      className="form-checkbox"
                      disabled={isImporting}
                    />
                    <span className="ml-2 text-sm text-gray-700">Update existing users (by email)</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={importOptions.validateOnly}
                      onChange={(e) => setImportOptions(prev => ({ ...prev, validateOnly: e.target.checked }))}
                      className="form-checkbox"
                      disabled={isImporting}
                    />
                    <span className="ml-2 text-sm text-gray-700">Validate only (don't import)</span>
                  </label>
                </div>
              </div>

              {/* Warning - UPDATED */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-yellow-800">Important Notes:</h4>
                    <ul className="mt-1 text-sm text-yellow-700 space-y-1">
                      <li>• Email and password columns are required for each user</li>
                      <li>• Default role will be 'student' if not specified</li>
                      <li>• Default status will be 'active' if not specified</li>
                      <li>• Duplicate emails will be skipped unless 'Update existing' is checked</li>
                      <li>• Users will need to change passwords on first login for security</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between px-6 py-4 space-x-3 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={downloadSampleExcel}
                className="btn btn-outline"
                disabled={isImporting}
              >
                Download Sample Template
              </button>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-outline"
                  disabled={isImporting}
                >
                  {isImporting ? 'Importing...' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isImporting || !file}
                  className="btn btn-primary"
                >
                  {isImporting ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Importing...
                    </div>
                  ) : (
                    <>
                      <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                      Import Users
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ImportUsersModal;