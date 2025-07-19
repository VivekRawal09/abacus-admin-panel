import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Transition } from '@headlessui/react';
import { 
  HomeIcon,
  UsersIcon,
  VideoCameraIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  CogIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useAuth } from '../../contexts/AuthContext';
import { PermissionGate } from '../auth/ProtectedRoute';

const Sidebar = ({ collapsed, mobileMenuOpen, onToggle, onMobileMenuClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Navigation items with permissions - Updated for role-based access
  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      permission: null, // Available to all authenticated users
      roles: ['super_admin', 'institute_admin'], // But only these roles should see it
    },
    {
      name: 'Users',
      href: '/users',
      icon: UsersIcon,
      permission: 'users',
      roles: ['super_admin', 'institute_admin'],
    },
    {
      name: 'Videos',
      href: '/videos',
      icon: VideoCameraIcon,
      permission: 'videos',
      roles: ['super_admin', 'institute_admin', 'parent', 'student'], // All roles can access
    },
    {
      name: 'Institutes',
      href: '/institutes',
      icon: BuildingOffice2Icon,
      permission: 'institutes',
      roles: ['super_admin', 'institute_admin'],
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: ChartBarIcon,
      permission: 'analytics',
      roles: ['super_admin', 'institute_admin'],
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: UserIcon,
      permission: null,
      roles: ['parent', 'student'], // Only non-admin users see profile
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: CogIcon,
      permission: 'settings',
      roles: ['super_admin', 'institute_admin'],
    },
  ];

  // Filter navigation items based on user role
  const getVisibleNavItems = () => {
    if (!user || !user.role) return [];
    
    return navigationItems.filter(item => {
      // If roles are specified for this item, check if user's role is included
      if (item.roles && item.roles.length > 0) {
        return item.roles.includes(user.role);
      }
      // If no roles specified, show to all users (fallback)
      return true;
    });
  };

  const visibleNavItems = getVisibleNavItems();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo and brand */}
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-primary-600 font-bold text-lg">A</span>
            </div>
          </div>
          {!collapsed && (
            <div className="ml-3">
              <h1 className="text-white text-xl font-bold">ABACUS</h1>
              <p className="text-primary-200 text-xs">
                {user?.role === 'parent' || user?.role === 'student' 
                  ? 'Learning Portal' 
                  : 'Admin Panel'
                }
              </p>
            </div>
          )}
        </div>
        
        {/* Desktop toggle button */}
        <button
          onClick={onToggle}
          className="hidden lg:block ml-auto p-1 rounded-md text-primary-200 hover:text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-white"
        >
          {collapsed ? (
            <ChevronRightIcon className="h-5 w-5" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5" />
          )}
        </button>

        {/* Mobile close button */}
        <button
          onClick={onMobileMenuClose}
          className="lg:hidden ml-auto p-1 rounded-md text-primary-200 hover:text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-white"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* User info with role indicator */}
      <div className="px-4 py-4 bg-primary-600 border-b border-primary-500">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
              </span>
            </div>
          </div>
          {!collapsed && (
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-primary-200 text-xs truncate capitalize">
                  {user?.role?.replace('_', ' ')}
                </span>
                <span className="ml-2 text-xs">
                  {user?.role === 'super_admin' && '🔑'}
                  {user?.role === 'institute_admin' && '🏫'}
                  {user?.role === 'parent' && '👨‍👩‍👧‍👦'}
                  {user?.role === 'student' && '🎓'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 bg-primary-800 space-y-1 overflow-y-auto">
        {visibleNavItems.map((item) => {
          // Check if user has permission for this item
          if (item.permission) {
            return (
              <PermissionGate key={item.name} permission={item.permission}>
                <NavigationLink 
                  item={item} 
                  collapsed={collapsed} 
                  currentPath={location.pathname}
                />
              </PermissionGate>
            );
          }

          // Show item without permission check (but role-filtered)
          return (
            <NavigationLink 
              key={item.name}
              item={item} 
              collapsed={collapsed} 
              currentPath={location.pathname}
            />
          );
        })}

        {/* Role-specific quick actions */}
        {!collapsed && (user?.role === 'parent' || user?.role === 'student') && (
          <div className="pt-4 mt-4 border-t border-primary-700">
            <h3 className="px-2 text-xs font-semibold text-primary-200 uppercase tracking-wider mb-2">
              Quick Actions
            </h3>
            <div className="space-y-1">
              {user?.role === 'student' && (
                <NavLink
                  to="/videos?category=practice"
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-primary-300 hover:bg-primary-700 hover:text-white transition-colors duration-150"
                >
                  <VideoCameraIcon className="flex-shrink-0 h-5 w-5 text-primary-400 group-hover:text-white" />
                  <span className="ml-3">Practice Videos</span>
                </NavLink>
              )}
              {user?.role === 'parent' && (
                <NavLink
                  to="/videos?category=progress"
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-primary-300 hover:bg-primary-700 hover:text-white transition-colors duration-150"
                >
                  <ChartBarIcon className="flex-shrink-0 h-5 w-5 text-primary-400 group-hover:text-white" />
                  <span className="ml-3">Child's Progress</span>
                </NavLink>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Footer with role-based content */}
      <div className="flex-shrink-0 bg-primary-900 px-4 py-3">
        {!collapsed && (
          <div className="text-center">
            <div className="mb-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-800 text-primary-200">
                {user?.role === 'super_admin' && '🔑 Super Admin'}
                {user?.role === 'institute_admin' && '🏫 Institute Admin'}
                {user?.role === 'parent' && '👨‍👩‍👧‍👦 Parent Account'}
                {user?.role === 'student' && '🎓 Student Account'}
              </span>
            </div>
            <p className="text-primary-300 text-xs">
              Version 1.0.0
            </p>
            <p className="text-primary-400 text-xs mt-1">
              © 2024 ABACUS LMS
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={classNames(
        'hidden lg:flex lg:flex-shrink-0 transition-all duration-300 ease-in-out',
        collapsed ? 'lg:w-20' : 'lg:w-64'
      )}>
        <div className="flex flex-col w-full">
          <div className="flex flex-col h-0 flex-1 bg-primary-800">
            <SidebarContent />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Transition show={mobileMenuOpen}>
        <div className="lg:hidden">
          <Transition.Child
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 z-50 flex">
              <Transition.Child
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-primary-800">
                  <SidebarContent />
                </div>
              </Transition.Child>
              <div className="flex-shrink-0 w-14">
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Transition>
    </>
  );
};

// Individual navigation link component
const NavigationLink = ({ item, collapsed, currentPath }) => {
  const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/');

  return (
    <NavLink
      to={item.href}
      className={({ isActive: linkActive }) =>
        classNames(
          'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150',
          {
            'bg-primary-900 text-white': isActive || linkActive,
            'text-primary-300 hover:bg-primary-700 hover:text-white': !isActive && !linkActive,
          }
        )
      }
      title={collapsed ? item.name : undefined}
    >
      <item.icon
        className={classNames(
          'flex-shrink-0 h-6 w-6 transition-colors duration-150',
          {
            'text-white': isActive,
            'text-primary-400 group-hover:text-white': !isActive,
          }
        )}
      />
      {!collapsed && (
        <span className="ml-3 flex-1">{item.name}</span>
      )}
      
      {/* Active indicator */}
      {isActive && !collapsed && (
        <div className="ml-auto">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      )}
    </NavLink>
  );
};

// Quick stats component for sidebar (updated for role-based content)
export const SidebarStats = ({ collapsed }) => {
  const { user } = useAuth();
  
  // Different stats based on role
  const getStatsForRole = () => {
    if (user?.role === 'parent') {
      return [
        { label: 'Child Progress', value: '85%', change: '+5%' },
        { label: 'Videos Watched', value: '12', change: '+3' },
        { label: 'Practice Time', value: '2.5h', change: '+0.5h' },
      ];
    } else if (user?.role === 'student') {
      return [
        { label: 'Completed', value: '78%', change: '+12%' },
        { label: 'Streak Days', value: '7', change: '+2' },
        { label: 'Points Earned', value: '245', change: '+35' },
      ];
    } else {
      // Admin stats
      return [
        { label: 'Active Users', value: '1,234', change: '+12%' },
        { label: 'Total Videos', value: '567', change: '+8%' },
        { label: 'Institutes', value: '89', change: '+3%' },
      ];
    }
  };

  const stats = getStatsForRole();

  if (collapsed) return null;

  return (
    <div className="px-4 py-3 bg-primary-700 border-t border-primary-600">
      <h3 className="text-xs font-semibold text-primary-200 uppercase tracking-wider mb-2">
        {user?.role === 'parent' || user?.role === 'student' ? 'Your Stats' : 'Quick Stats'}
      </h3>
      <div className="space-y-2">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">{stat.value}</p>
              <p className="text-primary-300 text-xs">{stat.label}</p>
            </div>
            <span className="text-success-400 text-xs font-medium">
              {stat.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;