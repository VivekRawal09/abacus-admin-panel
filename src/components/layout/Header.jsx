import React, { useState, Fragment } from 'react';
import { Menu, Transition, Disclosure } from '@headlessui/react';
import { 
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useAuth } from '../../contexts/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import SearchInput from '../common/SearchInput';
import { LogoutConfirmModal, useConfirmModal } from '../common/ConfirmModal';

const Header = ({ onMobileMenuToggle, onSidebarToggle, sidebarCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [globalSearch, setGlobalSearch] = useState('');
  const { isOpen: showLogoutModal, openModal: openLogoutModal, closeModal: closeLogoutModal } = useConfirmModal();

  // Mock notifications - replace with real data
  const notifications = [
    {
      id: 1,
      title: 'New student registration',
      message: 'John Doe has registered for Advanced Math course',
      time: '5 minutes ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Video upload complete',
      message: 'Algebra Basics video has been processed successfully',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 3,
      title: 'System maintenance',
      message: 'Scheduled maintenance completed successfully',
      time: '2 hours ago',
      unread: false,
    },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = async () => {
    closeLogoutModal();
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // Apply theme to document root
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleGlobalSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      // Navigate to search results or perform global search
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const userMenuItems = [
    {
      name: 'Your Profile',
      description: 'View and edit your profile',
      icon: UserCircleIcon,
      onClick: handleProfileClick,
    },
    {
      name: 'Settings',
      description: 'Manage your preferences',
      icon: Cog6ToothIcon,
      onClick: handleSettingsClick,
    },
    {
      name: 'Sign out',
      description: 'Sign out of your account',
      icon: ArrowRightOnRectangleIcon,
      onClick: () => openLogoutModal(),
      className: 'text-danger-600',
    },
  ];

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex-1 px-4 flex justify-between sm:px-6 lg:px-8">
        <div className="flex-1 flex items-center">
          {/* Mobile menu button */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Greeting and breadcrumb */}
          <div className="hidden sm:flex sm:items-center sm:ml-6 lg:ml-0">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {getGreeting()}, {user?.first_name}!
              </h1>
              <p className="text-sm text-gray-600 capitalize">
                {user?.role?.replace('_', ' ')} Dashboard
              </p>
            </div>
          </div>

          {/* Global search */}
          <div className="flex-1 max-w-lg mx-4 lg:mx-8">
            <SearchInput
              placeholder="Search users, videos, institutes..."
              value={globalSearch}
              onChange={setGlobalSearch}
              onSearch={handleGlobalSearch}
              size="medium"
              className="w-full"
            />
          </div>
        </div>

        <div className="ml-4 flex items-center md:ml-6 space-x-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <MoonIcon className="h-6 w-6" />
            ) : (
              <SunIcon className="h-6 w-6" />
            )}
          </button>

          {/* Notifications */}
          <Menu as="div" className="relative">
            <Menu.Button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 relative">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-danger-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </span>
              )}
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <p className="text-xs text-gray-500">{unreadCount} unread</p>
                  )}
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <Menu.Item key={notification.id}>
                        {({ active }) => (
                          <div
                            className={classNames(
                              'px-4 py-3 border-b border-gray-50 last:border-b-0',
                              {
                                'bg-gray-50': active,
                                'bg-primary-50': notification.unread && !active,
                              }
                            )}
                          >
                            <div className="flex items-start">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                              {notification.unread && (
                                <div className="flex-shrink-0 ml-2">
                                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </Menu.Item>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center">
                      <BellIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No notifications</p>
                    </div>
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <div className="px-4 py-2 border-t border-gray-100">
                    <button className="text-sm text-primary-600 hover:text-primary-500">
                      View all notifications
                    </button>
                  </div>
                )}
              </Menu.Items>
            </Transition>
          </Menu>

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 lg:p-2 lg:rounded-md lg:hover:bg-gray-50">
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                </span>
              </div>
              <span className="hidden ml-3 text-gray-700 text-sm font-medium lg:block">
                <span className="sr-only">Open user menu for </span>
                {user?.first_name} {user?.last_name}
              </span>
              <ChevronDownIcon className="hidden flex-shrink-0 ml-1 h-5 w-5 text-gray-400 lg:block" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <p className="text-xs text-gray-400 capitalize mt-1">
                    {user?.role?.replace('_', ' ')}
                  </p>
                </div>

                {userMenuItems.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <button
                        onClick={item.onClick}
                        className={classNames(
                          'flex w-full items-center px-4 py-2 text-sm',
                          {
                            'bg-gray-100 text-gray-900': active,
                            'text-gray-700': !active,
                          },
                          item.className
                        )}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        <div className="text-left">
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-xs text-gray-500">{item.description}</div>
                          )}
                        </div>
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>

      {/* Logout confirmation modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={closeLogoutModal}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default Header;