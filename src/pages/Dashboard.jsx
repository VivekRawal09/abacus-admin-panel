import React, { memo, useMemo, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import { analyticsService } from '../services/analytics';
import { videosService } from '../services/videos';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { 
  UsersIcon,
  VideoCameraIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  PlayIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  ClockIcon,
  TrophyIcon,
  BookOpenIcon,
  StarIcon,
  FireIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// Performance optimized Dashboard with memoization
const Dashboard = memo(() => {
  const { user, isLoading: authLoading } = useAuth();

  // Memoize role-based welcome content
  const welcomeContent = useMemo(() => {
    if (!user) {
      return {
        title: "Loading...",
        subtitle: "Please wait while we load your dashboard.",
        emoji: "⏳",
        bgGradient: "from-gray-600 to-gray-700",
        description: "Setting up your personalized experience."
      };
    }

    const firstName = user.first_name || user.name || 'there';

    const roleConfig = {
      super_admin: {
        title: `Welcome back, ${firstName}!`,
        subtitle: "You're managing the entire ABACUS ecosystem. Here's your platform overview.",
        emoji: "🔑",
        bgGradient: "from-blue-600 to-purple-600",
        description: "Monitor system performance, manage global settings, and oversee all institutes and users."
      },
      institute_admin: {
        title: `Hello ${firstName}!`,
        subtitle: "Welcome to your institute management dashboard. Here's what's happening today.",
        emoji: "🏫",
        bgGradient: "from-blue-600 to-cyan-600", 
        description: "Track your institute's progress, manage students and teachers, and monitor learning outcomes."
      },
      parent: {
        title: `Hi ${firstName}!`,
        subtitle: "Track your child's learning journey and celebrate their achievements.",
        emoji: "👨‍👩‍👧‍👦",
        bgGradient: "from-green-600 to-emerald-600",
        description: "Monitor progress, view completed lessons, and support your child's abacus learning adventure."
      },
      student: {
        title: `Welcome back, ${firstName}!`,
        subtitle: "Ready to continue your abacus learning adventure? Let's achieve new milestones!",
        emoji: "🎓",
        bgGradient: "from-orange-600 to-red-600",
        description: "Practice daily, unlock achievements, and master the art of mental mathematics."
      }
    };

    return roleConfig[user?.role] || {
      title: `Welcome, ${firstName}!`,
      subtitle: "Welcome to your ABACUS learning platform dashboard.",
      emoji: "✨",
      bgGradient: "from-gray-600 to-gray-700",
      description: "Your personalized learning experience awaits."
    };
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Welcome Section - Memoized */}
        <WelcomeSection welcomeContent={welcomeContent} />

        {/* Role-Specific Stats Overview */}
        <RoleBasedStatsOverview user={user} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RoleBasedRecentActivity user={user} />
          </div>
          <div>
            <RoleBasedQuickActions user={user} />
          </div>
        </div>

        {/* Additional Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RoleBasedContentSection1 user={user} />
          <RoleBasedContentSection2 user={user} />
        </div>
      </div>
    </ErrorBoundary>
  );
});

Dashboard.displayName = 'Dashboard';

// Separated Welcome Section component for better optimization
const WelcomeSection = memo(({ welcomeContent }) => (
  <div className={`bg-gradient-to-r ${welcomeContent.bgGradient} rounded-lg shadow-sm`}>
    <div className="px-6 py-8 sm:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-start space-x-4">
          <div className="text-4xl">{welcomeContent.emoji}</div>
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              {welcomeContent.title}
            </h1>
            <p className="mt-2 text-blue-100 max-w-xl">
              {welcomeContent.subtitle}
            </p>
            <p className="mt-1 text-blue-200 text-sm max-w-2xl">
              {welcomeContent.description}
            </p>
          </div>
        </div>
        <div className="hidden sm:block">
          <div className="flex items-center space-x-2 text-blue-200">
            <ClockIcon className="h-5 w-5" />
            <span className="text-sm">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
));

WelcomeSection.displayName = 'WelcomeSection';

// Optimized Stats Overview with better error handling and memoization
const RoleBasedStatsOverview = memo(({ user }) => {
  const { data: stats, loading, error } = useApi(
    'dashboard-stats',
    useCallback(() => {
      console.log('🔍 Fetching dashboard stats from backend...');
      return analyticsService.getDashboardStats();
    }, []),
    { 
      showErrorToast: false,
      refetchInterval: 5 * 60 * 1000,
      onSuccess: useCallback((data) => console.log('✅ Real dashboard data:', data), []),
      onError: useCallback((error) => console.log('❌ Dashboard API error:', error), [])
    }
  );

  // Memoize role-specific stats configuration
  const roleStats = useMemo(() => {
    console.log('📊 Computing stats for role:', user?.role, 'with data:', stats);
    
    const roleStatsConfig = {
      super_admin: [
        {
          name: 'Total Users',
          value: stats?.totalUsers?.toString() || stats?.dashboard?.overview?.total_users?.toString() || '0',
          change: stats?.usersChange || '+0%',
          changeType: 'increase',
          icon: UsersIcon,
          color: 'primary',
        },
        {
          name: 'Active Videos',
          value: stats?.totalVideos?.toString() || stats?.dashboard?.overview?.total_videos?.toString() || '0',
          change: stats?.videosChange || '+0%',
          changeType: 'increase',
          icon: VideoCameraIcon,
          color: 'success',
        },
        {
          name: 'Institutes',
          value: stats?.totalInstitutes?.toString() || stats?.dashboard?.overview?.total_institutes?.toString() || '0',
          change: stats?.institutesChange || '+0%',
          changeType: 'increase',
          icon: BuildingOffice2Icon,
          color: 'warning',
        },
        {
          name: 'Monthly Views',
          value: stats?.monthlyViews || stats?.dashboard?.video_stats?.total_views?.toString() || '0',
          change: stats?.viewsChange || '+0%',
          changeType: 'increase',
          icon: EyeIcon,
          color: 'info',
        },
      ],
      institute_admin: [
        {
          name: 'Total Students',
          value: stats?.dashboard?.overview?.total_students?.toString() || '0',
          change: '+0%',
          changeType: 'increase',
          icon: AcademicCapIcon,
          color: 'primary',
        },
        {
          name: 'Active Videos',
          value: stats?.totalVideos?.toString() || stats?.dashboard?.overview?.total_videos?.toString() || '0',
          change: '+0',
          changeType: 'increase',
          icon: BookOpenIcon,
          color: 'success',
        },
        {
          name: 'Engagement Rate',
          value: stats?.dashboard?.overview?.engagement_rate || '0%',
          change: '+0%',
          changeType: 'increase',
          icon: CheckCircleIcon,
          color: 'warning',
        },
        {
          name: 'Active Users',
          value: stats?.dashboard?.overview?.active_users?.toString() || '0',
          change: '+0%',
          changeType: 'increase',
          icon: UserGroupIcon,
          color: 'info',
        },
      ],
      parent: [
        {
          name: 'Child Progress',
          value: '0%',
          change: '+0%',
          changeType: 'increase',
          icon: TrophyIcon,
          color: 'primary',
        },
        {
          name: 'Videos Watched',
          value: '0',
          change: '+0',
          changeType: 'increase',
          icon: VideoCameraIcon,
          color: 'success',
        },
        {
          name: 'Practice Streak',
          value: '0 days',
          change: '+0',
          changeType: 'increase',
          icon: FireIcon,
          color: 'warning',
        },
        {
          name: 'Achievements',
          value: '0',
          change: '+0',
          changeType: 'increase',
          icon: StarIcon,
          color: 'info',
        },
      ],
      student: [
        {
          name: 'Level Progress',
          value: '0%',
          change: '+0%',
          changeType: 'increase',
          icon: TrophyIcon,
          color: 'primary',
        },
        {
          name: 'Lessons Done',
          value: '0',
          change: '+0',
          changeType: 'increase',
          icon: CheckCircleIcon,
          color: 'success',
        },
        {
          name: 'Current Streak',
          value: '0 days',
          change: '+0',
          changeType: 'increase',
          icon: FireIcon,
          color: 'warning',
        },
        {
          name: 'Points Earned',
          value: '0',
          change: '+0',
          changeType: 'increase',
          icon: StarIcon,
          color: 'info',
        },
      ]
    };

    return roleStatsConfig[user?.role] || [];
  }, [stats, user?.role]);

  if (loading) {
    return <StatsLoadingSkeleton />;
  }

  if (error) {
    return <StatsErrorState error={error} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {roleStats.map((stat) => (
        <StatCard key={stat.name} stat={stat} />
      ))}
    </div>
  );
});

RoleBasedStatsOverview.displayName = 'RoleBasedStatsOverview';

// Extracted loading skeleton for reusability
const StatsLoadingSkeleton = memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            <div className="ml-4 flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
));

StatsLoadingSkeleton.displayName = 'StatsLoadingSkeleton';

// Extracted error state for reusability
const StatsErrorState = memo(({ error }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
    <div className="text-center">
      <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400 mb-4" />
      <h3 className="text-lg font-medium text-red-900 mb-2">API Connection Error</h3>
      <p className="text-red-700 mb-4">Failed to load dashboard statistics from backend.</p>
      <p className="text-sm text-red-600">
        Error: {error?.message || 'Unknown error occurred'}
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Reload Dashboard
      </button>
    </div>
  </div>
));

StatsErrorState.displayName = 'StatsErrorState';

// Optimized StatCard with memoization
const StatCard = memo(({ stat }) => {
  const colorClasses = useMemo(() => ({
    primary: 'bg-blue-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-cyan-500 text-white',
  }), []);

  const changeColor = useMemo(() => 
    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
  , [stat.changeType]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${colorClasses[stat.color]}`}>
          <stat.icon className="h-6 w-6" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{stat.name}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            <p className={`ml-2 flex items-baseline text-sm font-semibold ${changeColor}`}>
              <ArrowTrendingUpIcon className="self-center flex-shrink-0 h-4 w-4" />
              <span className="sr-only">
                {stat.changeType === 'increase' ? 'Increased' : 'Decreased'} by
              </span>
              {stat.change}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

StatCard.displayName = 'StatCard';

// Optimized Popular Videos with better error handling and memoization
const PopularVideos = memo(() => {
  const { data: videosResponse, loading, error } = useApi(
    'popular-videos',
    useCallback(() => {
      console.log('🎥 Fetching real videos from backend...');
      return videosService.getVideos({ limit: 5, sort: 'view_count', order: 'desc' });
    }, []),
    { 
      showErrorToast: false,
      onSuccess: useCallback((data) => console.log('✅ Real videos data:', data), []),
      onError: useCallback((error) => console.log('❌ Videos API error:', error), [])
    }
  );

  const videos = useMemo(() => {
    if (videosResponse?.data && Array.isArray(videosResponse.data)) {
      return videosResponse.data;
    }
    if (videosResponse?.videos && Array.isArray(videosResponse.videos)) {
      return videosResponse.videos;
    }
    return [];
  }, [videosResponse]);

  const formatDuration = useCallback((seconds) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Popular Videos</h3>
        <p className="text-sm text-gray-500">Most viewed content from your backend</p>
      </div>
      <div className="p-6">
        {loading ? (
          <VideoLoadingSkeleton />
        ) : error ? (
          <VideoErrorState error={error} />
        ) : videos.length > 0 ? (
          <VideoList videos={videos} formatDuration={formatDuration} />
        ) : (
          <EmptyVideoState />
        )}
        <div className="mt-6">
          <a
            href="/videos"
            className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors"
          >
            View all videos →
          </a>
        </div>
      </div>
    </div>
  );
});

PopularVideos.displayName = 'PopularVideos';

// Extracted video components for better performance
const VideoLoadingSkeleton = memo(() => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="animate-pulse flex items-center space-x-3">
        <div className="w-12 h-8 bg-gray-200 rounded"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
));

VideoLoadingSkeleton.displayName = 'VideoLoadingSkeleton';

const VideoErrorState = memo(({ error }) => (
  <div className="text-center py-8">
    <VideoCameraIcon className="mx-auto h-12 w-12 text-red-400 mb-4" />
    <h3 className="text-lg font-medium text-red-900 mb-2">Failed to Load Videos</h3>
    <p className="text-red-600">Could not connect to backend API.</p>
    <p className="text-sm text-red-500 mt-2">Error: {error?.message || 'Unknown error'}</p>
  </div>
));

VideoErrorState.displayName = 'VideoErrorState';

const VideoList = memo(({ videos, formatDuration }) => (
  <div className="space-y-4">
    {videos.slice(0, 5).map((video, index) => (
      <VideoItem 
        key={video.id} 
        video={video} 
        index={index} 
        formatDuration={formatDuration} 
      />
    ))}
  </div>
));

VideoList.displayName = 'VideoList';

const VideoItem = memo(({ video, index, formatDuration }) => (
  <div className="flex items-center space-x-3">
    <div className="flex-shrink-0 w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
      <PlayIcon className="h-4 w-4 text-gray-500" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 truncate">
        {video.title}
      </p>
      <div className="flex items-center space-x-2 text-xs text-gray-500">
        <span>{(video.view_count || 0).toLocaleString()} views</span>
        <span>•</span>
        <span>{formatDuration(video.duration)}</span>
      </div>
    </div>
    <div className="flex-shrink-0">
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        #{index + 1}
      </span>
    </div>
  </div>
));

VideoItem.displayName = 'VideoItem';

const EmptyVideoState = memo(() => (
  <div className="text-center py-8">
    <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-sm font-medium text-gray-900">No videos found</h3>
    <p className="mt-1 text-sm text-gray-500">No videos returned from backend API.</p>
  </div>
));

EmptyVideoState.displayName = 'EmptyVideoState';

// Other components with memoization
const RoleBasedRecentActivity = memo(({ user }) => {
  const activities = useMemo(() => {
    const roleActivities = {
      super_admin: [
        {
          id: 1,
          type: 'institute_added',
          user: 'Zone Manager',
          action: 'added new institute',
          details: 'Excellence Learning Center',
          time: '5 minutes ago',
          icon: BuildingOffice2Icon,
          iconColor: 'text-blue-600',
        },
        {
          id: 2,
          type: 'system_update',
          user: 'System',
          action: 'completed maintenance update',
          details: 'Video streaming optimization',
          time: '1 hour ago',
          icon: ChartBarIcon,
          iconColor: 'text-green-600',
        },
      ],
      institute_admin: [
        {
          id: 1,
          type: 'student_registration',
          user: 'John Doe',
          action: 'registered as new student',
          details: 'Level 1 - Basic Abacus',
          time: '10 minutes ago',
          icon: UserGroupIcon,
          iconColor: 'text-green-600',
        },
        {
          id: 2,
          type: 'assessment_completed',
          user: 'Sarah Smith',
          action: 'completed assessment',
          details: 'Basic Addition Quiz - Score: 95%',
          time: '1 hour ago',
          icon: AcademicCapIcon,
          iconColor: 'text-purple-600',
        },
      ],
      parent: [
        {
          id: 1,
          type: 'practice_completed',
          user: 'Your Child',
          action: 'completed practice session',
          details: '2-digit addition - 15 minutes',
          time: '2 hours ago',
          icon: CheckCircleIcon,
          iconColor: 'text-green-600',
        },
        {
          id: 2,
          type: 'achievement_unlocked',
          user: 'Your Child',
          action: 'unlocked new achievement',
          details: '7-day practice streak!',
          time: '1 day ago',
          icon: TrophyIcon,
          iconColor: 'text-yellow-600',
        },
      ],
      student: [
        {
          id: 1,
          type: 'lesson_completed',
          user: 'You',
          action: 'completed lesson',
          details: 'Advanced Multiplication Techniques',
          time: '30 minutes ago',
          icon: CheckCircleIcon,
          iconColor: 'text-green-600',
        },
        {
          id: 2,
          type: 'points_earned',
          user: 'You',
          action: 'earned points',
          details: '+50 points for perfect practice!',
          time: '2 hours ago',
          icon: StarIcon,
          iconColor: 'text-yellow-600',
        },
      ]
    };

    return roleActivities[user?.role] || [];
  }, [user?.role]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        <p className="text-sm text-gray-500">
          {user?.role === 'parent' || user?.role === 'student' 
            ? 'Your latest learning activities' 
            : 'Latest updates from your platform'
          }
        </p>
      </div>
      <div className="p-6">
        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((activity, activityIdx) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                isLast={activityIdx === activities.length - 1}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
});

RoleBasedRecentActivity.displayName = 'RoleBasedRecentActivity';

const ActivityItem = memo(({ activity, isLast }) => (
  <li>
    <div className="relative pb-8">
      {!isLast && (
        <span
          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
          aria-hidden="true"
        />
      )}
      <div className="relative flex space-x-3">
        <div>
          <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-gray-100">
            <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
          </span>
        </div>
        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
          <div>
            <p className="text-sm text-gray-500">
              <span className="font-medium text-gray-900">{activity.user}</span>{' '}
              {activity.action}
              {activity.details && (
                <span className="font-medium text-gray-900"> {activity.details}</span>
              )}
            </p>
          </div>
          <div className="text-right text-sm whitespace-nowrap text-gray-500">
            {activity.time}
          </div>
        </div>
      </div>
    </div>
  </li>
));

ActivityItem.displayName = 'ActivityItem';

const RoleBasedQuickActions = memo(({ user }) => {
  const actions = useMemo(() => {
    const roleActions = {
      super_admin: [
        {
          name: 'Add New Institute',
          description: 'Register a new learning center',
          href: '/institutes?action=create',
          icon: BuildingOffice2Icon,
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
        },
        {
          name: 'System Analytics',
          description: 'View platform performance',
          href: '/analytics',
          icon: ChartBarIcon,
          iconColor: 'text-purple-600',
          bgColor: 'bg-purple-50',
        },
        {
          name: 'Manage Users',
          description: 'View all platform users',
          href: '/users',
          icon: UsersIcon,
          iconColor: 'text-green-600',
          bgColor: 'bg-green-50',
        },
      ],
      institute_admin: [
        {
          name: 'Add Student',
          description: 'Register new student',
          href: '/users?action=create&type=student',
          icon: AcademicCapIcon,
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
        },
        {
          name: 'Upload Content',
          description: 'Add educational videos',
          href: '/videos?action=upload',
          icon: VideoCameraIcon,
          iconColor: 'text-green-600',
          bgColor: 'bg-green-50',
        },
        {
          name: 'View Reports',
          description: 'Student progress reports',
          href: '/analytics',
          icon: ChartBarIcon,
          iconColor: 'text-purple-600',
          bgColor: 'bg-purple-50',
        },
      ],
      parent: [
        {
          name: 'View Progress',
          description: "Check your child's learning",
          href: '/videos?category=progress',
          icon: ChartBarIcon,
          iconColor: 'text-green-600',
          bgColor: 'bg-green-50',
        },
        {
          name: 'Practice Videos',
          description: 'Find practice sessions',
          href: '/videos?category=practice',
          icon: VideoCameraIcon,
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
        },
        {
          name: 'Achievements',
          description: 'View earned badges',
          href: '/profile?tab=achievements',
          icon: TrophyIcon,
          iconColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
        },
      ],
      student: [
        {
          name: 'Continue Learning',
          description: 'Resume your last lesson',
          href: '/videos?continue=true',
          icon: PlayIcon,
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
        },
        {
          name: 'Practice Session',
          description: 'Start daily practice',
          href: '/videos?category=practice',
          icon: BookOpenIcon,
          iconColor: 'text-green-600',
          bgColor: 'bg-green-50',
        },
        {
          name: 'My Achievements',
          description: 'View your progress',
          href: '/profile?tab=achievements',
          icon: TrophyIcon,
          iconColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
        },
      ]
    };

    return roleActions[user?.role] || [];
  }, [user?.role]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        <p className="text-sm text-gray-500">
          {user?.role === 'parent' || user?.role === 'student' 
            ? 'Continue your learning journey' 
            : 'Commonly used features'
          }
        </p>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {actions.map((action) => (
            <QuickActionItem key={action.name} action={action} />
          ))}
        </div>
      </div>
    </div>
  );
});

RoleBasedQuickActions.displayName = 'RoleBasedQuickActions';

const QuickActionItem = memo(({ action }) => (
  <a
    href={action.href}
    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
  >
    <div className={`flex-shrink-0 p-2 rounded-md ${action.bgColor}`}>
      <action.icon className={`h-5 w-5 ${action.iconColor}`} />
    </div>
    <div className="ml-3 flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
        {action.name}
      </p>
      <p className="text-sm text-gray-500">{action.description}</p>
    </div>
  </a>
));

QuickActionItem.displayName = 'QuickActionItem';

// Role-Based Content Section 1
const RoleBasedContentSection1 = memo(({ user }) => {
  if (user?.role === 'parent' || user?.role === 'student') {
    return <LearningProgress user={user} />;
  } else {
    return <PopularVideos />;
  }
});

RoleBasedContentSection1.displayName = 'RoleBasedContentSection1';

// Role-Based Content Section 2
const RoleBasedContentSection2 = memo(({ user }) => {
  if (user?.role === 'parent' || user?.role === 'student') {
    return <Achievements user={user} />;
  } else {
    return <SystemStatus />;
  }
});

RoleBasedContentSection2.displayName = 'RoleBasedContentSection2';

// Learning Progress Component (for Parents/Students) - Optimized
const LearningProgress = memo(({ user }) => {
  const progressData = useMemo(() => {
    return user?.role === 'student' ? [
      { subject: 'Basic Addition', progress: 95, status: 'completed' },
      { subject: 'Subtraction', progress: 80, status: 'in-progress' },
      { subject: 'Multiplication', progress: 45, status: 'in-progress' },
      { subject: 'Division', progress: 0, status: 'locked' },
    ] : [
      { subject: 'Overall Progress', progress: 78, status: 'in-progress' },
      { subject: 'Practice Consistency', progress: 90, status: 'excellent' },
      { subject: 'Speed Improvement', progress: 65, status: 'good' },
      { subject: 'Accuracy Rate', progress: 88, status: 'excellent' },
    ];
  }, [user?.role]);

  const getProgressColor = useCallback((progress) => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-gray-400';
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          {user?.role === 'student' ? 'Your Learning Progress' : "Child's Learning Progress"}
        </h3>
        <p className="text-sm text-gray-500">Track mastery across different topics</p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {progressData.map((item, index) => (
            <ProgressItem 
              key={index} 
              item={item} 
              getProgressColor={getProgressColor} 
            />
          ))}
        </div>
      </div>
    </div>
  );
});

LearningProgress.displayName = 'LearningProgress';

const ProgressItem = memo(({ item, getProgressColor }) => (
  <div className="flex items-center justify-between">
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-900">{item.subject}</span>
        <span className="text-sm text-gray-500">{item.progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${getProgressColor(item.progress)}`}
          style={{ width: `${item.progress}%` }}
        ></div>
      </div>
    </div>
  </div>
));

ProgressItem.displayName = 'ProgressItem';

// Achievements Component (for Parents/Students) - Optimized
const Achievements = memo(({ user }) => {
  const achievementsData = useMemo(() => {
    return user?.role === 'student' ? [
      { name: 'First Steps', description: 'Completed first lesson', icon: '🎯', unlocked: true },
      { name: 'Practice Streak', description: '7 days in a row', icon: '🔥', unlocked: true },
      { name: 'Speed Demon', description: 'Completed 50 problems in 5 minutes', icon: '⚡', unlocked: true },
      { name: 'Perfectionist', description: '100% accuracy in 10 sessions', icon: '💎', unlocked: false },
    ] : [
      { name: 'Supportive Parent', description: 'Child completed 10 lessons', icon: '💝', unlocked: true },
      { name: 'Consistency Champion', description: 'Child practiced 30 days', icon: '🏆', unlocked: true },
      { name: 'Progress Tracker', description: 'Viewed progress 20 times', icon: '📊', unlocked: true },
      { name: 'Learning Advocate', description: 'Child reached advanced level', icon: '🌟', unlocked: false },
    ];
  }, [user?.role]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          {user?.role === 'student' ? 'Your Achievements' : 'Family Achievements'}
        </h3>
        <p className="text-sm text-gray-500">Celebrate learning milestones</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {achievementsData.map((achievement, index) => (
            <AchievementItem key={index} achievement={achievement} />
          ))}
        </div>
      </div>
    </div>
  );
});

Achievements.displayName = 'Achievements';

const AchievementItem = memo(({ achievement }) => (
  <div
    className={`p-4 rounded-lg border-2 text-center transition-all ${
      achievement.unlocked
        ? 'border-blue-200 bg-blue-50'
        : 'border-gray-200 bg-gray-50 opacity-60'
    }`}
  >
    <div className="text-2xl mb-2">{achievement.icon}</div>
    <h4 className={`text-sm font-medium mb-1 ${
      achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
    }`}>
      {achievement.name}
    </h4>
    <p className={`text-xs ${
      achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
    }`}>
      {achievement.description}
    </p>
  </div>
));

AchievementItem.displayName = 'AchievementItem';

// System Status Component - Optimized
const SystemStatus = memo(() => {
  const statusItems = useMemo(() => [
    { name: 'API Server', status: 'operational', uptime: '99.9%' },
    { name: 'Database', status: 'operational', uptime: '99.8%' },
    { name: 'Video Streaming', status: 'operational', uptime: '99.7%' },
    { name: 'File Storage', status: 'operational', uptime: '99.9%' },
  ], []);

  const getStatusColor = useCallback((status) => {
    const colors = {
      operational: 'bg-green-100 text-green-800',
      degraded: 'bg-yellow-100 text-yellow-800',
      down: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">System Status</h3>
        <p className="text-sm text-gray-500">Current platform health</p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {statusItems.map((item) => (
            <SystemStatusItem 
              key={item.name} 
              item={item} 
              getStatusColor={getStatusColor} 
            />
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Overall Status</span>
            <span className="font-medium text-green-600">All Systems Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
});

SystemStatus.displayName = 'SystemStatus';

const SystemStatusItem = memo(({ item, getStatusColor }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <span className="text-sm font-medium text-gray-900">{item.name}</span>
    </div>
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-500">{item.uptime}</span>
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(item.status)}`}>
        {item.status}
      </span>
    </div>
  </div>
));

SystemStatusItem.displayName = 'SystemStatusItem';

export default Dashboard;