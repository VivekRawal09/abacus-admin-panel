import React, { Suspense, memo, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';

// CRITICAL OPTIMIZATION: Lazy load all page components for code splitting
const LoginPage = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Users = React.lazy(() => import('./pages/Users'));
const Videos = React.lazy(() => import('./pages/Videos'));
const Institutes = React.lazy(() => import('./pages/Institutes'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Profile = React.lazy(() => import('./pages/Profile'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

/**
 * Optimized App Component with Code Splitting and Lazy Loading
 * CRITICAL: This optimization affects initial bundle size and loading performance
 */
const App = memo(() => {
  // OPTIMIZED: Use specific auth hook for better performance
  const { isAuthenticated, isLoading } = useAuthState();

  // Memoized loading component to prevent unnecessary re-renders
  const loadingComponent = useMemo(() => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-600">Loading ABACUS...</p>
      </div>
    </div>
  ), []);

  // Memoized route loading fallback
  const routeLoadingFallback = useMemo(() => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <LoadingSpinner size="medium" />
        <p className="mt-2 text-gray-600 text-sm">Loading page...</p>
      </div>
    </div>
  ), []);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return loadingComponent;
  }

  return (
    <ErrorBoundary>
      <div className="App">
        <Suspense fallback={routeLoadingFallback}>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Suspense fallback={<PageLoadingFallback pageName="Login" />}>
                    <LoginPage />
                  </Suspense>
                )
              }
            />

            {/* Protected Routes with Layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Dashboard Routes */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route 
                path="dashboard" 
                element={
                  <Suspense fallback={<PageLoadingFallback pageName="Dashboard" />}>
                    <Dashboard />
                  </Suspense>
                } 
              />

              {/* User Management Routes */}
              <Route 
                path="users" 
                element={
                  <Suspense fallback={<PageLoadingFallback pageName="Users" />}>
                    <Users />
                  </Suspense>
                } 
              />
              <Route 
                path="users/:id" 
                element={
                  <Suspense fallback={<PageLoadingFallback pageName="User Details" />}>
                    <Users />
                  </Suspense>
                } 
              />

              {/* Video Management Routes */}
              <Route 
                path="videos" 
                element={
                  <Suspense fallback={<PageLoadingFallback pageName="Videos" />}>
                    <Videos />
                  </Suspense>
                } 
              />
              <Route 
                path="videos/:id" 
                element={
                  <Suspense fallback={<PageLoadingFallback pageName="Video Details" />}>
                    <Videos />
                  </Suspense>
                } 
              />

              {/* Institute Management Routes */}
              <Route 
                path="institutes" 
                element={
                  <Suspense fallback={<PageLoadingFallback pageName="Institutes" />}>
                    <Institutes />
                  </Suspense>
                } 
              />
              <Route 
                path="institutes/:id" 
                element={
                  <Suspense fallback={<PageLoadingFallback pageName="Institute Details" />}>
                    <Institutes />
                  </Suspense>
                } 
              />

              {/* Analytics Routes */}
              <Route 
                path="analytics" 
                element={
                  <Suspense fallback={<PageLoadingFallback pageName="Analytics" />}>
                    <Analytics />
                  </Suspense>
                } 
              />
              <Route 
                path="analytics/:type" 
                element={
                  <Suspense fallback={<PageLoadingFallback pageName="Analytics Details" />}>
                    <Analytics />
                  </Suspense>
                } 
              />

              {/* Settings & Profile Routes */}
              <Route 
                path="settings" 
                element={
                  <Suspense fallback={<PageLoadingFallback pageName="Settings" />}>
                    <Settings />
                  </Suspense>
                } 
              />
              <Route 
                path="profile" 
                element={
                  <Suspense fallback={<PageLoadingFallback pageName="Profile" />}>
                    <Profile />
                  </Suspense>
                } 
              />
            </Route>

            {/* 404 Page */}
            <Route 
              path="*" 
              element={
                <Suspense fallback={<PageLoadingFallback pageName="Page" />}>
                  <NotFound />
                </Suspense>
              } 
            />
          </Routes>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
});

App.displayName = 'App';

// Optimized Page Loading Fallback Component
const PageLoadingFallback = memo(({ pageName = "Page" }) => {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <LoadingSpinner size="medium" />
        <p className="mt-3 text-gray-600 text-sm">Loading {pageName}...</p>
        <div className="mt-2 w-32 h-1 bg-gray-200 rounded mx-auto overflow-hidden">
          <div className="h-full bg-blue-500 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
});

PageLoadingFallback.displayName = 'PageLoadingFallback';

// ADVANCED OPTIMIZATION: Route-based code splitting with preloading
export const preloadRoutes = {
  // Preload critical routes that users are likely to visit
  dashboard: () => import('./pages/Dashboard'),
  users: () => import('./pages/Users'),
  videos: () => import('./pages/Videos'),
  institutes: () => import('./pages/Institutes'),
  
  // Utility function to preload a specific route
  preload: (routeName) => {
    if (preloadRoutes[routeName]) {
      return preloadRoutes[routeName]();
    }
  },
  
  // Preload all critical routes (call this after login)
  preloadCritical: () => {
    Promise.all([
      preloadRoutes.dashboard(),
      preloadRoutes.users(),
      preloadRoutes.videos(),
      preloadRoutes.institutes()
    ]);
  }
};

export default App;