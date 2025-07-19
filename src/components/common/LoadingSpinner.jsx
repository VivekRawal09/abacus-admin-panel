import React from 'react';
import classNames from 'classnames';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  text = '',
  center = false,
  overlay = false,
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16',
  };

  const colorClasses = {
    primary: 'border-primary-600',
    secondary: 'border-gray-600',
    success: 'border-success-600',
    warning: 'border-warning-600',
    danger: 'border-danger-600',
    white: 'border-white',
  };

  const spinnerClasses = classNames(
    'animate-spin rounded-full border-2 border-gray-200',
    sizeClasses[size],
    colorClasses[color],
    className
  );

  const containerClasses = classNames(
    'flex items-center justify-center',
    {
      'fixed inset-0 bg-black bg-opacity-50 z-50': overlay,
      'w-full h-full': center && !overlay,
    }
  );

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl',
  };

  const Spinner = () => (
    <div className={spinnerClasses} style={{ borderTopColor: 'transparent' }}>
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (overlay || center) {
    return (
      <div className={containerClasses}>
        <div className="flex flex-col items-center space-y-3">
          <Spinner />
          {text && (
            <p className={classNames(
              'text-gray-600 font-medium',
              textSizeClasses[size],
              { 'text-white': overlay }
            )}>
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <Spinner />
      {text && (
        <span className={classNames(
          'text-gray-600 font-medium',
          textSizeClasses[size]
        )}>
          {text}
        </span>
      )}
    </div>
  );
};

// Skeleton loader component
export const SkeletonLoader = ({ 
  lines = 3, 
  className = '',
  animate = true 
}) => {
  const skeletonClasses = classNames(
    'bg-gray-200 rounded',
    {
      'animate-pulse': animate,
    },
    className
  );

  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={classNames(skeletonClasses, {
            'h-4': true,
            'w-full': index < lines - 1,
            'w-3/4': index === lines - 1,
          })}
        />
      ))}
    </div>
  );
};

// Card skeleton
export const CardSkeleton = ({ className = '' }) => {
  return (
    <div className={classNames('bg-white rounded-lg shadow-sm border border-gray-200 p-6', className)}>
      <div className="animate-pulse">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
};

// Table skeleton
export const TableSkeleton = ({ rows = 5, columns = 4, className = '' }) => {
  return (
    <div className={classNames('bg-white rounded-lg shadow-sm border border-gray-200', className)}>
      <div className="animate-pulse">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, index) => (
              <div key={index} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="border-b border-gray-200 px-6 py-4 last:border-b-0">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Button loading state
export const ButtonLoader = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5',
  };

  return (
    <div className={classNames(
      'animate-spin rounded-full border-2 border-white border-opacity-30',
      sizeClasses[size]
    )} style={{ borderTopColor: 'white' }}>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Full page loader
export const PageLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="large" color="primary" />
        <p className="mt-4 text-lg text-gray-600 font-medium">{text}</p>
        <p className="mt-2 text-sm text-gray-500">Please wait while we load your content</p>
      </div>
    </div>
  );
};

// Inline loader for content sections
export const InlineLoader = ({ text = 'Loading...', className = '' }) => {
  return (
    <div className={classNames('flex items-center justify-center py-8', className)}>
      <LoadingSpinner size="medium" color="primary" text={text} />
    </div>
  );
};

export default LoadingSpinner;