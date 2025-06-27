import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUserPreferences } from '../hooks/useLocalStorage';
import { 
  CogIcon,
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  PaintBrushIcon,
  ComputerDesktopIcon,
  KeyIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuth();
  const { preferences, updatePreferences } = useUserPreferences();
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);

  const tabs = [
    { id: 'general', name: 'General', icon: CogIcon },
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon },
    { id: 'system', name: 'System', icon: ComputerDesktopIcon },
  ];

  const handleSave = async (section, data) => {
    setSaving(true);
    try {
      updatePreferences({ [section]: { ...preferences[section], ...data } });
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <CogIcon className="h-8 w-8 mr-3 text-primary-600" />
            Settings
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      {/* Settings Layout */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200">
            <nav className="p-4 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={classNames(
                    'w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700 border-primary-300'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <tab.icon className="h-5 w-5 mr-3" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {activeTab === 'general' && <GeneralSettings onSave={handleSave} saving={saving} />}
            {activeTab === 'profile' && <ProfileSettings user={user} onSave={handleSave} saving={saving} />}
            {activeTab === 'notifications' && <NotificationSettings preferences={preferences} onSave={handleSave} saving={saving} />}
            {activeTab === 'security' && <SecuritySettings onSave={handleSave} saving={saving} />}
            {activeTab === 'appearance' && <AppearanceSettings preferences={preferences} onSave={handleSave} saving={saving} />}
            {activeTab === 'system' && <SystemSettings preferences={preferences} onSave={handleSave} saving={saving} />}
          </div>
        </div>
      </div>
    </div>
  );
};

// General Settings Component
const GeneralSettings = ({ onSave, saving }) => {
  const [settings, setSettings] = useState({
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave('general', settings);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">General Settings</h2>
        <p className="text-sm text-gray-600">Configure basic application settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="form-select"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div>
            <label className="form-label">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              className="form-select"
            >
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Time</option>
              <option value="PST">Pacific Time</option>
              <option value="CST">Central Time</option>
            </select>
          </div>

          <div>
            <label className="form-label">Date Format</label>
            <select
              value={settings.dateFormat}
              onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
              className="form-select"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="form-label">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="form-select"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="INR">INR - Indian Rupee</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Profile Settings Component
const ProfileSettings = ({ user, onSave, saving }) => {
  const [profile, setProfile] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave('profile', profile);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
        <p className="text-sm text-gray-600">Update your personal information and profile details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-6">
          <div className="h-20 w-20 rounded-full bg-primary-600 flex items-center justify-center">
            <span className="text-2xl font-medium text-white">
              {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
            </span>
          </div>
          <div>
            <button type="button" className="btn btn-outline">
              Change Avatar
            </button>
            <p className="text-sm text-gray-500 mt-1">JPG, GIF or PNG. 1MB max.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">First Name</label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Last Name</label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="form-input"
            />
          </div>
        </div>

        <div>
          <label className="form-label">Bio</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            rows={4}
            className="form-textarea"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div>
          <label className="form-label">Location</label>
          <input
            type="text"
            value={profile.location}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            className="form-input"
            placeholder="City, Country"
          />
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Notification Settings Component
const NotificationSettings = ({ preferences, onSave, saving }) => {
  const [notifications, setNotifications] = useState({
    email: preferences.notifications?.email ?? true,
    push: preferences.notifications?.push ?? true,
    sms: preferences.notifications?.sms ?? false,
    marketing: preferences.notifications?.marketing ?? true,
    security: preferences.notifications?.security ?? true,
    updates: preferences.notifications?.updates ?? true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave('notifications', notifications);
  };

  const notificationTypes = [
    {
      id: 'email',
      title: 'Email Notifications',
      description: 'Receive notifications via email',
    },
    {
      id: 'push',
      title: 'Push Notifications',
      description: 'Receive browser push notifications',
    },
    {
      id: 'sms',
      title: 'SMS Notifications',
      description: 'Receive notifications via text message',
    },
    {
      id: 'marketing',
      title: 'Marketing Updates',
      description: 'Receive updates about new features and promotions',
    },
    {
      id: 'security',
      title: 'Security Alerts',
      description: 'Receive alerts about account security',
    },
    {
      id: 'updates',
      title: 'System Updates',
      description: 'Receive notifications about system maintenance',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
        <p className="text-sm text-gray-600">Choose how you want to be notified</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {notificationTypes.map((type) => (
            <div key={type.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{type.title}</h3>
                <p className="text-sm text-gray-500">{type.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[type.id]}
                  onChange={(e) => setNotifications({ ...notifications, [type.id]: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Security Settings Component
const SecuritySettings = ({ onSave, saving }) => {
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: false,
    loginAlerts: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (security.newPassword !== security.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    onSave('security', security);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
        <p className="text-sm text-gray-600">Manage your account security and privacy</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-base font-medium text-gray-900 mb-4">Change Password</h3>
          <div className="space-y-4">
            <div>
              <label className="form-label">Current Password</label>
              <input
                type="password"
                value={security.currentPassword}
                onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">New Password</label>
              <input
                type="password"
                value={security.newPassword}
                onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                value={security.confirmPassword}
                onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-base font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={security.twoFactor}
                onChange={(e) => setSecurity({ ...security, twoFactor: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Appearance Settings Component
const AppearanceSettings = ({ preferences, onSave, saving }) => {
  const [appearance, setAppearance] = useState({
    theme: preferences.theme || 'light',
    sidebarCollapsed: preferences.sidebarCollapsed || false,
    density: preferences.density || 'comfortable',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave('appearance', appearance);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">Appearance</h2>
        <p className="text-sm text-gray-600">Customize how the interface looks and feels</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="form-label">Theme</label>
          <div className="grid grid-cols-3 gap-3">
            {['light', 'dark', 'system'].map((theme) => (
              <button
                key={theme}
                type="button"
                onClick={() => setAppearance({ ...appearance, theme })}
                className={classNames(
                  'p-4 border-2 rounded-lg text-center capitalize',
                  appearance.theme === theme
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                {theme}
                {appearance.theme === theme && (
                  <CheckIcon className="h-5 w-5 text-primary-600 mx-auto mt-2" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="form-label">Interface Density</label>
          <div className="grid grid-cols-3 gap-3">
            {['compact', 'comfortable', 'spacious'].map((density) => (
              <button
                key={density}
                type="button"
                onClick={() => setAppearance({ ...appearance, density })}
                className={classNames(
                  'p-4 border-2 rounded-lg text-center capitalize',
                  appearance.density === density
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                {density}
                {appearance.density === density && (
                  <CheckIcon className="h-5 w-5 text-primary-600 mx-auto mt-2" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

// System Settings Component
const SystemSettings = ({ preferences, onSave, saving }) => {
  const [system, setSystem] = useState({
    tablePageSize: preferences.tablePageSize || 20,
    autoRefresh: preferences.autoRefresh || true,
    soundEnabled: preferences.soundEnabled || true,
    keyboardShortcuts: preferences.keyboardShortcuts || true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave('system', system);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">System Preferences</h2>
        <p className="text-sm text-gray-600">Configure system behavior and performance</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="form-label">Default Table Page Size</label>
          <select
            value={system.tablePageSize}
            onChange={(e) => setSystem({ ...system, tablePageSize: Number(e.target.value) })}
            className="form-select"
          >
            <option value={10}>10 rows</option>
            <option value={20}>20 rows</option>
            <option value={50}>50 rows</option>
            <option value={100}>100 rows</option>
          </select>
        </div>

        <div className="space-y-4">
          {[
            { key: 'autoRefresh', label: 'Auto-refresh data', description: 'Automatically refresh data every few minutes' },
            { key: 'soundEnabled', label: 'Sound notifications', description: 'Play sounds for notifications and alerts' },
            { key: 'keyboardShortcuts', label: 'Keyboard shortcuts', description: 'Enable keyboard shortcuts for quick actions' },
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{setting.label}</h3>
                <p className="text-sm text-gray-500">{setting.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={system[setting.key]}
                  onChange={(e) => setSystem({ ...system, [setting.key]: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;