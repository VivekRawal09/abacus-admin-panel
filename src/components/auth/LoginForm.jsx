import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { EyeIcon, EyeSlashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { ButtonLoader } from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

// Validation schema
const loginSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginForm = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      clearErrors();
      
      const result = await login(data.email, data.password);
      
      if (result.success) {
        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem('remember_me', 'true');
        } else {
          localStorage.removeItem('remember_me');
        }
        
        if (onSuccess) {
          // Pass the role-based redirect path to the parent component
          onSuccess(result.redirectTo);
        }
      } else {
        // Handle login failure
        if (result.error?.includes('email')) {
          setError('email', { type: 'manual', message: result.error });
        } else if (result.error?.includes('password')) {
          setError('password', { type: 'manual', message: result.error });
        } else {
          setError('root', { type: 'manual', message: result.error || 'Login failed' });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('root', { 
        type: 'manual', 
        message: 'An unexpected error occurred. Please try again.' 
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // FIXED: Correct passwords that match backend (admin123, not admin123)
  const testAccounts = [
    { email: 'admin@abacuslearn.com', password: 'admin123', role: 'Super Admin', landing: 'Dashboard' },
    { email: 'admin@brightfuture.edu.in', password: 'admin123', role: 'Institute Admin', landing: 'Dashboard' },
    { email: 'rakesh.parent@gmail.com', password: 'admin123', role: 'Parent', landing: 'Videos' },
    { email: 'arjun.student@gmail.com', password: 'admin123', role: 'Student', landing: 'Videos' },
  ];

  const fillTestAccount = (account) => {
    document.querySelector('input[name="email"]').value = account.email;
    document.querySelector('input[name="password"]').value = account.password;
    // Trigger form update
    const emailEvent = new Event('input', { bubbles: true });
    const passwordEvent = new Event('input', { bubbles: true });
    document.querySelector('input[name="email"]').dispatchEvent(emailEvent);
    document.querySelector('input[name="password"]').dispatchEvent(passwordEvent);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Global Error */}
        {errors.root && (
          <div className="bg-danger-50 border border-danger-200 rounded-md p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-danger-400" />
              <div className="ml-3">
                <p className="text-sm text-danger-800">{errors.root.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            className={`form-input ${errors.email ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500' : ''}`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="form-error">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              autoComplete="current-password"
              className={`form-input pr-10 ${errors.password ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500' : ''}`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="form-error">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <button
              type="button"
              onClick={() => toast.success('Password reset functionality coming soon!')}
              className="text-primary-600 hover:text-primary-500"
            >
              Forgot your password?
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="btn btn-primary w-full"
        >
          {isSubmitting || isLoading ? (
            <div className="flex items-center justify-center">
              <ButtonLoader size="small" />
              <span className="ml-2">Signing in...</span>
            </div>
          ) : (
            'Sign in'
          )}
        </button>

        {/* Test Accounts Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Test Accounts:</h3>
          <div className="space-y-2">
            {testAccounts.map((account, index) => (
              <button
                key={index}
                type="button"
                onClick={() => fillTestAccount(account)}
                className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors"
                disabled={isSubmitting || isLoading}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{account.role}</p>
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                        → {account.landing}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{account.email}</p>
                  </div>
                  <span className="text-xs text-gray-500">Click to fill</span>
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Each role lands on a different page after login
          </p>
        </div>

        {/* Development Notice */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-xs text-blue-700">
              <strong>Development Mode:</strong> Test different user roles and see how each lands on their appropriate starting page.
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

// Separate component for login page layout
export const LoginPageLayout = ({ children, title = "Welcome back", subtitle = "Sign in to your account" }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800">
        <div className="flex flex-col justify-center items-center w-full px-12 text-white">
          <div className="max-w-md text-center">
            <h1 className="text-4xl font-bold mb-4">ABACUS</h1>
            <p className="text-xl mb-8 text-primary-100">Learning Management System</p>
            <div className="space-y-4 text-primary-200">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary-300 rounded-full mr-3"></div>
                <span>Comprehensive student management</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary-300 rounded-full mr-3"></div>
                <span>Interactive video learning</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary-300 rounded-full mr-3"></div>
                <span>Real-time analytics and reporting</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary-300 rounded-full mr-3"></div>
                <span>Multi-level user hierarchy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            <p className="mt-2 text-gray-600">{subtitle}</p>
          </div>
          
          {children}
          
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              © 2024 ABACUS Learning Management System. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;