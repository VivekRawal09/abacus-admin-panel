import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm, { LoginPageLayout } from '../components/auth/LoginForm';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Login = () => {
  const { isAuthenticated, isLoading, user, getRoleLandingPage } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading && user) {
      // Use role-based landing page instead of always going to dashboard
      const from = location.state?.from?.pathname;
      const destination = from || getRoleLandingPage(user.role);
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, isLoading, user, navigate, location, getRoleLandingPage]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" text="Loading..." />
      </div>
    );
  }

  // Don't render if already authenticated
  if (isAuthenticated) {
    return null;
  }

  // Handle successful login with role-based redirect
  const handleLoginSuccess = (redirectTo) => {
    // Use the redirectTo path from the login result, or fall back to original logic
    const from = location.state?.from?.pathname;
    const destination = from || redirectTo || '/dashboard';
    navigate(destination, { replace: true });
  };

  return (
    <LoginPageLayout
      title="Welcome back"
      subtitle="Sign in to your ABACUS admin account"
    >
      <LoginForm onSuccess={handleLoginSuccess} />
    </LoginPageLayout>
  );
};

export default Login;