import React from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
    if (process.env.NODE_ENV === 'production') {
      // Log to error tracking service (e.g., Sentry, LogRocket, etc.)
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService = (error, errorInfo) => {
    // Implement error logging service integration here
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Example: Send to your error tracking service
    console.log('Error Report:', errorReport);
  };

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;
      
      // Custom fallback component
      if (Fallback) {
        return (
          <Fallback 
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            onRetry={this.handleRetry}
            onReload={this.handleReload}
          />
        );
      }

      // Default error UI
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
          onReload={this.handleReload}
        />
      );
    }

    return this.props.children;
  }
}

// Default error fallback component
const ErrorFallback = ({ error, errorInfo, onRetry, onReload }) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <ExclamationTriangleIcon className="h-16 w-16 text-danger-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Oops! Something went wrong
        </h1>
        
        <p className="text-gray-600 mb-6">
          We're sorry for the inconvenience. An unexpected error has occurred.
        </p>

        {isDevelopment && error && (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
            <h3 className="font-semibold text-gray-800 mb-2">Error Details:</h3>
            <p className="text-sm text-gray-700 font-mono break-all">
              {error.message}
            </p>
            {error.stack && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                  View Stack Trace
                </summary>
                <pre className="mt-2 text-xs text-gray-600 overflow-auto max-h-40 whitespace-pre-wrap">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRetry}
            className="btn btn-primary flex items-center justify-center"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Try Again
          </button>
          
          <button
            onClick={onReload}
            className="btn btn-outline"
          >
            Reload Page
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          If the problem persists, please contact support.
        </p>
      </div>
    </div>
  );
};

// Smaller error boundary for components
export const ComponentErrorBoundary = ({ children, fallback }) => {
  return (
    <ErrorBoundary fallback={fallback || ComponentErrorFallback}>
      {children}
    </ErrorBoundary>
  );
};

// Fallback for component errors
const ComponentErrorFallback = ({ error, onRetry }) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 my-4">
      <div className="flex items-start">
        <ExclamationTriangleIcon className="h-5 w-5 text-danger-400 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-danger-800">
            Component Error
          </h3>
          <p className="text-sm text-danger-700 mt-1">
            This component failed to render properly.
          </p>
          
          {isDevelopment && error && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs text-danger-600 hover:text-danger-800">
                Error Details
              </summary>
              <pre className="mt-1 text-xs text-danger-600 overflow-auto max-h-20">
                {error.message}
              </pre>
            </details>
          )}
          
          <button
            onClick={onRetry}
            className="mt-2 text-xs bg-danger-100 hover:bg-danger-200 text-danger-800 px-2 py-1 rounded transition-colors"
          >
            Retry Component
          </button>
        </div>
      </div>
    </div>
  );
};

// Hook for handling async errors in functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const handleError = React.useCallback((error) => {
    console.error('Async error caught:', error);
    setError(error);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  // Throw error to be caught by ErrorBoundary
  if (error) {
    throw error;
  }

  return { handleError, clearError };
};

// HOC for wrapping components with error boundary
export const withErrorBoundary = (Component, errorFallback) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary fallback={errorFallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Network error fallback
export const NetworkErrorFallback = ({ onRetry }) => (
  <div className="text-center py-8">
    <ExclamationTriangleIcon className="h-12 w-12 text-warning-500 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      Network Error
    </h3>
    <p className="text-gray-600 mb-4">
      Unable to connect to the server. Please check your internet connection.
    </p>
    <button onClick={onRetry} className="btn btn-primary">
      <ArrowPathIcon className="h-4 w-4 mr-2" />
      Retry
    </button>
  </div>
);

// API error fallback
export const ApiErrorFallback = ({ error, onRetry }) => {
  const getErrorMessage = () => {
    if (error?.response?.status === 404) {
      return "The requested resource was not found.";
    }
    if (error?.response?.status === 403) {
      return "You don't have permission to access this resource.";
    }
    if (error?.response?.status === 500) {
      return "Internal server error. Please try again later.";
    }
    return error?.message || "An unexpected error occurred.";
  };

  return (
    <div className="text-center py-8">
      <ExclamationTriangleIcon className="h-12 w-12 text-danger-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-600 mb-4">
        {getErrorMessage()}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-primary">
          <ArrowPathIcon className="h-4 w-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorBoundary;