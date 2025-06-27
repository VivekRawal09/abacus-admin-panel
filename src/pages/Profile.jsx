import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  UserCircleIcon,
  PencilIcon,
  KeyIcon,
  ClockIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOffice2Icon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { ROLE_LABELS, ROLE_COLORS } from '../utils/constants';
import { dateHelpers } from '../utils/helpers';
import classNames from 'classnames';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [saving, setSaving] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // In a real app, you would call an API to update the user
      // For now, we'll just update the local state
      updateUser({ ...user, ...editForm });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
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
            <UserCircleIcon className="h-8 w-8 mr-3 text-primary-600" />
            My Profile
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your personal information and account settings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <ProfileCard user={user} />
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2">
          <ProfileInformation 
            user={user}
            isEditing={isEditing}
            editForm={editForm}
            setEditForm={setEditForm}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            saving={saving}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Statistics */}
        <AccountStatistics user={user} />

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </div>
  );
};

// Profile Card Component
const ProfileCard = ({ user }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 h-24"></div>
      <div className="px-6 pb-6">
        <div className="flex justify-center -mt-12 mb-4">
          <div className="h-24 w-24 rounded-full bg-white p-2 shadow-lg">
            <div className="h-full w-full rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">
            {user?.first_name} {user?.last_name}
          </h2>
          <div className="mt-2">
            <span className={classNames(
              'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
              ROLE_COLORS[user?.role] || 'bg-gray-100 text-gray-800'
            )}>
              {ROLE_LABELS[user?.role] || user?.role}
            </span>
          </div>
          <p className="text-gray-600 mt-2">{user?.email}</p>
        </div>

        <div className="mt-6 space-y-3">
          {user?.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <PhoneIcon className="h-4 w-4 mr-2" />
              {user.phone}
            </div>
          )}
          
          {user?.institute_name && (
            <div className="flex items-center text-sm text-gray-600">
              <BuildingOffice2Icon className="h-4 w-4 mr-2" />
              {user.institute_name}
            </div>
          )}
          
          {user?.address && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPinIcon className="h-4 w-4 mr-2" />
              {user.address}
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-600">
            <ClockIcon className="h-4 w-4 mr-2" />
            Joined {dateHelpers.formatDate(user?.created_at)}
          </div>
        </div>

        <div className="mt-6">
          <button className="w-full btn btn-outline">
            <KeyIcon className="h-4 w-4 mr-2" />
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

// Profile Information Component
const ProfileInformation = ({ 
  user, 
  isEditing, 
  editForm, 
  setEditForm, 
  onEdit, 
  onSave, 
  onCancel, 
  saving 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
        {!isEditing ? (
          <button onClick={onEdit} className="btn btn-outline">
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </button>
        ) : (
          <div className="flex space-x-2">
            <button onClick={onSave} disabled={saving} className="btn btn-success">
              <CheckIcon className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={onCancel} className="btn btn-outline">
              <XMarkIcon className="h-4 w-4 mr-2" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="p-6">
        {isEditing ? (
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  value={editForm.first_name}
                  onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                  className="form-input"
                />
              </div>
              
              <div>
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  value={editForm.last_name}
                  onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                  className="form-input"
                />
              </div>
              
              <div>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="form-input"
                />
              </div>
              
              <div>
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>
            
            <div>
              <label className="form-label">Address</label>
              <textarea
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                rows={3}
                className="form-textarea"
              />
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">First Name</label>
                <p className="mt-1 text-sm text-gray-900">{user?.first_name || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Last Name</label>
                <p className="mt-1 text-sm text-gray-900">{user?.last_name || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Email Address</label>
                <p className="mt-1 text-sm text-gray-900">{user?.email || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Phone Number</label>
                <p className="mt-1 text-sm text-gray-900">{user?.phone || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Role</label>
                <p className="mt-1 text-sm text-gray-900">{ROLE_LABELS[user?.role] || user?.role}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className="mt-1">
                  <span className={classNames(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    user?.is_active ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'
                  )}>
                    {user?.is_active ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Address</label>
              <p className="mt-1 text-sm text-gray-900">{user?.address || 'Not provided'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Account Statistics Component
const AccountStatistics = ({ user }) => {
  const stats = [
    {
      name: 'Videos Watched',
      value: '124',
      description: 'Total videos completed',
      color: 'primary',
    },
    {
      name: 'Watch Time',
      value: '48.5h',
      description: 'Total learning hours',
      color: 'success',
    },
    {
      name: 'Assessments',
      value: '23',
      description: 'Completed assessments',
      color: 'warning',
    },
    {
      name: 'Progress',
      value: '76%',
      description: 'Overall completion',
      color: 'info',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Account Statistics</h3>
        <p className="text-sm text-gray-500">Your learning progress and activity</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.name} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={classNames(
                'text-2xl font-bold',
                `text-${stat.color}-600`
              )}>
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-900 mt-1">
                {stat.name}
              </div>
              <div className="text-xs text-gray-500">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Recent Activity Component
const RecentActivity = () => {
  const activities = [
    {
      action: 'Completed video',
      details: 'Advanced Multiplication Techniques',
      time: '2 hours ago',
      type: 'video',
    },
    {
      action: 'Updated profile',
      details: 'Changed phone number',
      time: '1 day ago',
      type: 'profile',
    },
    {
      action: 'Completed assessment',
      details: 'Basic Math Quiz - Score: 95%',
      time: '2 days ago',
      type: 'assessment',
    },
    {
      action: 'Started course',
      details: 'Introduction to Calculus',
      time: '3 days ago',
      type: 'course',
    },
    {
      action: 'Login',
      details: 'Signed in from new device',
      time: '1 week ago',
      type: 'security',
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'video':
        return '📹';
      case 'profile':
        return '👤';
      case 'assessment':
        return '📋';
      case 'course':
        return '📚';
      case 'security':
        return '🔒';
      default:
        return '📌';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        <p className="text-sm text-gray-500">Your latest actions and updates</p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="text-lg">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.action}
                </p>
                <p className="text-sm text-gray-500">
                  {activity.details}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <button className="text-sm text-primary-600 hover:text-primary-500 font-medium">
            View all activity →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;