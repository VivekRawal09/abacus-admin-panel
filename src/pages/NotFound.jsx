import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ExclamationTriangleIcon,
  HomeIcon,
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* 404 Number */}
          <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
          
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <ExclamationTriangleIcon className="h-24 w-24 text-gray-400" />
          </div>
          
          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          
          {/* Description */}
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or the URL might be incorrect.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGoHome}
              className="btn btn-primary flex items-center justify-center"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Go to Dashboard
            </button>
            
            <button
              onClick={handleGoBack}
              className="btn btn-outline flex items-center justify-center"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Go Back
            </button>
          </div>

          {/* Additional Help */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              What can you do?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Check the URL</h4>
                <p>Make sure the web address is spelled correctly</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Contact Support</h4>
                <p>If you believe this is an error, contact our support team</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Error Code: 404 | ABACUS Learning Management System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;