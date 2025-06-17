// Sample data for the Abacus Learning App Demo

export const demoCredentials = {
  email: 'student@demo.com',
  password: 'demo123',
  studentName: 'Rahul',
  studentId: 'ST001',
};

export const courseLevels = [
  {
    id: 1,
    title: 'Level 1: Basic Numbers',
    description: 'Learn basic number recognition and bead movement',
    progress: 100,
    status: 'completed',
    totalLessons: 3,
    completedLessons: 3,
    duration: '2h 15m',
    difficulty: 'Beginner',
    color: '#4CAF50',
    icon: 'checkmark-circle',
    instructor: 'Prof. Rajesh Kumar',
    enrolled: 1247,
    rating: 4.8,
    completedDate: '2024-05-15',
    certificate: true,
    lessons: [
      {
        id: 1,
        title: 'Introduction to Abacus',
        description: 'Learn about the history and structure of abacus',
        duration: '5:30',
        completed: true,
        videoId: 'intro_abacus',
        type: 'video'
      },
      {
        id: 2,
        title: 'Basic Bead Movement',
        description: 'Understand how to move beads correctly',
        duration: '7:45',
        completed: true,
        videoId: 'bead_movement',
        type: 'video'
      },
      {
        id: 3,
        title: 'Number Formation 1-10',
        description: 'Practice forming numbers 1 through 10',
        duration: '8:20',
        completed: true,
        videoId: 'numbers_1_10',
        type: 'video'
      }
    ]
  },
  {
    id: 2,
    title: 'Level 2: Simple Addition',
    description: 'Master single-digit addition using abacus',
    progress: 60,
    status: 'in_progress',
    totalLessons: 5,
    completedLessons: 3,
    duration: '3h 45m',
    difficulty: 'Beginner',
    color: '#2196F3',
    icon: 'play-circle',
    instructor: 'Prof. Rajesh Kumar',
    enrolled: 892,
    rating: 4.7,
    completedDate: null,
    certificate: false,
    lessons: [
      {
        id: 4,
        title: 'Addition Basics',
        description: 'Understand the concept of addition on abacus',
        duration: '6:15',
        completed: true,
        videoId: 'addition_basics',
        type: 'video'
      },
      {
        id: 5,
        title: 'Single Digit Addition',
        description: 'Practice adding single digits step by step',
        duration: '9:30',
        completed: true,
        videoId: 'single_digit_add',
        type: 'video'
      },
      {
        id: 6,
        title: 'Practice Exercises',
        description: 'Solve practice problems to strengthen your skills',
        duration: '10:00',
        completed: false,
        videoId: 'practice_exercises',
        type: 'video'
      },
      {
        id: 7,
        title: 'Speed Building',
        description: 'Increase your calculation speed',
        duration: '8:45',
        completed: false,
        videoId: 'speed_building',
        type: 'video'
      },
      {
        id: 8,
        title: 'Assessment Test',
        description: 'Test your understanding with a quiz',
        duration: '15:00',
        completed: false,
        videoId: 'assessment_test',
        type: 'quiz'
      }
    ]
  },
  {
    id: 3,
    title: 'Level 3: Advanced Addition',
    description: 'Learn multi-digit addition techniques',
    progress: 0,
    status: 'locked',
    totalLessons: 6,
    completedLessons: 0,
    duration: '4h 20m',
    difficulty: 'Intermediate',
    color: '#FF9800',
    icon: 'lock-closed',
    instructor: 'Prof. Rajesh Kumar',
    enrolled: 543,
    rating: 4.9,
    completedDate: null,
    certificate: false,
    lessons: [
      {
        id: 9,
        title: 'Two-Digit Addition',
        description: 'Master addition with carrying',
        duration: '12:00',
        completed: false,
        videoId: 'two_digit_add',
        type: 'video'
      },
      {
        id: 10,
        title: 'Three-Digit Addition',
        description: 'Advanced multi-digit techniques',
        duration: '15:00',
        completed: false,
        videoId: 'three_digit_add',
        type: 'video'
      }
    ]
  },
  {
    id: 4,
    title: 'Level 4: Subtraction',
    description: 'Master subtraction with borrowing',
    progress: 0,
    status: 'locked',
    totalLessons: 5,
    completedLessons: 0,
    duration: '3h 50m',
    difficulty: 'Intermediate',
    color: '#9C27B0',
    icon: 'lock-closed',
    instructor: 'Prof. Rajesh Kumar',
    enrolled: 324,
    rating: 4.6,
    completedDate: null,
    certificate: false,
    lessons: []
  },
  {
    id: 5,
    title: 'Level 5: Multiplication',
    description: 'Learn multiplication techniques',
    progress: 0,
    status: 'locked',
    totalLessons: 7,
    completedLessons: 0,
    duration: '5h 15m',
    difficulty: 'Advanced',
    color: '#F44336',
    icon: 'lock-closed',
    instructor: 'Prof. Rajesh Kumar',
    enrolled: 156,
    rating: 4.8,
    completedDate: null,
    certificate: false,
    lessons: []
  }
];

export const achievements = [
  {
    id: 1,
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: 'walk',
    earned: true,
    earnedDate: '2024-05-10',
    color: '#4CAF50',
  },
  {
    id: 2,
    title: 'Level Master',
    description: 'Complete Level 1',
    icon: 'trophy',
    earned: true,
    earnedDate: '2024-05-15',
    color: '#FFD700',
  },
  {
    id: 3,
    title: 'Speed Demon',
    description: 'Complete 5 exercises in under 2 minutes each',
    icon: 'flash',
    earned: true,
    earnedDate: '2024-05-18',
    color: '#FF5722',
  },
  {
    id: 4,
    title: 'Consistent Learner',
    description: 'Study for 7 days in a row',
    icon: 'calendar',
    earned: true,
    earnedDate: '2024-05-22',
    color: '#2196F3',
  },
  {
    id: 5,
    title: 'Perfect Score',
    description: 'Get 100% on a level test',
    icon: 'star',
    earned: false,
    earnedDate: null,
    color: '#9C27B0',
  },
  {
    id: 6,
    title: 'Dedication',
    description: 'Study for 30 days total',
    icon: 'medal',
    earned: false,
    earnedDate: null,
    color: '#FF9800',
  },
  {
    id: 7,
    title: 'Abacus Master',
    description: 'Complete all 5 levels',
    icon: 'school',
    earned: false,
    earnedDate: null,
    color: '#673AB7',
  },
  {
    id: 8,
    title: 'Lightning Fast',
    description: 'Complete 10 calculations under 30 seconds',
    icon: 'flash',
    earned: false,
    earnedDate: null,
    color: '#FFC107',
  }
];

export const weeklyActivity = [
  { day: 'Mon', minutes: 25, lessons: 1, date: '2025-06-16' },
  { day: 'Tue', minutes: 30, lessons: 2, date: '2025-06-17' },
  { day: 'Wed', minutes: 0, lessons: 0, date: '2025-06-18' },
  { day: 'Thu', minutes: 45, lessons: 2, date: '2025-06-19' },
  { day: 'Fri', minutes: 20, lessons: 1, date: '2025-06-20' },
  { day: 'Sat', minutes: 35, lessons: 1, date: '2025-06-21' },
  { day: 'Sun', minutes: 40, lessons: 2, date: '2025-06-22' },
];

export const studentStats = {
  totalTimeSpent: '47h 32m',
  lessonsCompleted: 12,
  totalLessons: 28,
  currentStreak: 7,
  longestStreak: 15,
  averageSessionTime: '24 minutes',
  skillLevel: 'Intermediate',
  nextMilestone: 'Complete Level 3',
  overallProgress: 43, // percentage
  certificatesEarned: 1,
  practiceSessionsCompleted: 23,
  averageScore: 87,
};

export const subscriptionPlans = [
  {
    id: 'monthly',
    name: 'Monthly Premium',
    price: '₹299',
    period: '/month',
    originalPrice: null,
    discount: null,
    features: [
      'Access to all levels',
      'Unlimited practice sessions',
      'Progress tracking',
      'Certificate generation',
      'Priority support',
      'Offline content download',
    ],
    popular: false,
    current: true,
  },
  {
    id: 'yearly',
    name: 'Yearly Premium',
    price: '₹2,399',
    period: '/year',
    originalPrice: '₹3,588',
    discount: '33% OFF',
    features: [
      'Access to all levels',
      'Unlimited practice sessions',
      'Progress tracking',
      'Certificate generation',
      'Priority support',
      'Offline content download',
      'Advanced analytics',
      'One-on-one mentoring (2 sessions)',
    ],
    popular: true,
    current: false,
  },
  {
    id: 'lifetime',
    name: 'Lifetime Access',
    price: '₹4,999',
    period: 'one-time',
    originalPrice: '₹9,999',
    discount: '50% OFF',
    features: [
      'Lifetime access to all content',
      'All future course updates',
      'Premium support for life',
      'Advanced analytics',
      'Unlimited mentoring sessions',
      'Priority new feature access',
      'Commercial usage rights',
    ],
    popular: false,
    current: false,
  },
];

export const currentSubscription = {
  plan: 'Monthly Premium',
  price: '₹299',
  period: 'month',
  status: 'active',
  nextBilling: '2025-07-15',
  daysLeft: 28,
  autoRenewal: true,
  startDate: '2024-05-15',
};

export const paymentHistory = [
  {
    id: 1,
    date: '2025-06-15',
    amount: '₹299',
    plan: 'Monthly Premium',
    status: 'success',
    method: 'Credit Card ****1234',
    transactionId: 'TXN123456789',
  },
  {
    id: 2,
    date: '2025-05-15',
    amount: '₹299',
    plan: 'Monthly Premium',
    status: 'success',
    method: 'UPI - Google Pay',
    transactionId: 'TXN123456788',
  },
  {
    id: 3,
    date: '2025-04-15',
    amount: '₹299',
    plan: 'Monthly Premium',
    status: 'success',
    method: 'Credit Card ****1234',
    transactionId: 'TXN123456787',
  },
];

export const exerciseProblems = [
  { id: 1, question: "5 + 3", answer: 8, difficulty: 'easy' },
  { id: 2, question: "7 + 2", answer: 9, difficulty: 'easy' },
  { id: 3, question: "4 + 6", answer: 10, difficulty: 'easy' },
  { id: 4, question: "8 + 5", answer: 13, difficulty: 'easy' },
  { id: 5, question: "9 + 7", answer: 16, difficulty: 'easy' },
  { id: 6, question: "12 + 8", answer: 20, difficulty: 'medium' },
  { id: 7, question: "15 + 7", answer: 22, difficulty: 'medium' },
  { id: 8, question: "23 + 19", answer: 42, difficulty: 'medium' },
  { id: 9, question: "34 + 28", answer: 62, difficulty: 'medium' },
  { id: 10, question: "45 + 37", answer: 82, difficulty: 'hard' },
  { id: 11, question: "67 + 48", answer: 115, difficulty: 'hard' },
  { id: 12, question: "89 + 56", answer: 145, difficulty: 'hard' },
];

export const appSettings = {
  theme: 'light',
  language: 'english',
  notifications: true,
  soundEffects: true,
  vibration: false,
  autoSave: true,
  downloadOverWifi: true,
  abacusSize: 'medium',
  beadColor: 'golden',
  backgroundMusic: false,
  pushNotifications: true,
  emailNotifications: false,
  weeklyProgress: true,
  practiceReminders: true,
  achievementNotifications: true,
};

export const contactInfo = {
  email: 'support@abacuslearning.com',
  phone: '+91-9876543210',
  whatsapp: '+91-9876543210',
  address: 'Abacus Learning Inc.\n123 Education Street\nLearning City, India 400001',
  businessHours: 'Monday - Friday: 9:00 AM - 6:00 PM IST\nSaturday: 10:00 AM - 4:00 PM IST\nSunday: Closed',
  website: 'https://www.abacuslearning.com',
  supportEmail: 'help@abacuslearning.com',
  salesEmail: 'sales@abacuslearning.com',
};

export const socialLinks = {
  facebook: 'https://facebook.com/abacuslearning',
  twitter: 'https://twitter.com/abacuslearning',
  instagram: 'https://instagram.com/abacuslearning',
  youtube: 'https://youtube.com/c/abacuslearning',
  linkedin: 'https://linkedin.com/company/abacuslearning',
};

export const appInfo = {
  version: '1.0.0',
  buildNumber: '100',
  releaseDate: '2025-06-17',
  developer: 'Abacus Learning Inc.',
  copyright: '© 2025 Abacus Learning Inc.',
  privacyPolicy: 'https://www.abacuslearning.com/privacy',
  termsOfService: 'https://www.abacuslearning.com/terms',
  licenses: 'https://www.abacuslearning.com/licenses',
};

// Utility functions for working with the data
export const getCourseById = (id) => {
  return courseLevels.find(course => course.id === id);
};

export const getLessonById = (lessonId) => {
  for (const course of courseLevels) {
    const lesson = course.lessons.find(l => l.id === lessonId);
    if (lesson) return lesson;
  }
  return null;
};

export const getNextLesson = (currentLessonId) => {
  for (const course of courseLevels) {
    const currentIndex = course.lessons.findIndex(l => l.id === currentLessonId);
    if (currentIndex !== -1) {
      // Check if there's a next lesson in the same course
      if (currentIndex + 1 < course.lessons.length) {
        return course.lessons[currentIndex + 1];
      }
      // Check if there's a next course
      const nextCourse = courseLevels.find(c => c.id === course.id + 1);
      if (nextCourse && nextCourse.lessons.length > 0) {
        return nextCourse.lessons[0];
      }
    }
  }
  return null;
};

export const getCompletedLessonsCount = () => {
  let count = 0;
  courseLevels.forEach(course => {
    course.lessons.forEach(lesson => {
      if (lesson.completed) count++;
    });
  });
  return count;
};

export const getTotalLessonsCount = () => {
  let count = 0;
  courseLevels.forEach(course => {
    count += course.lessons.length;
  });
  return count;
};

export const getOverallProgress = () => {
  const completed = getCompletedLessonsCount();
  const total = getTotalLessonsCount();
  return total > 0 ? Math.round((completed / total) * 100) : 0;
};

export const getEarnedAchievements = () => {
  return achievements.filter(achievement => achievement.earned);
};

export const getCurrentWeekActivity = () => {
  return weeklyActivity;
};

export const getTotalStudyTime = () => {
  return weeklyActivity.reduce((total, day) => total + day.minutes, 0);
};

export default {
  demoCredentials,
  courseLevels,
  achievements,
  weeklyActivity,
  studentStats,
  subscriptionPlans,
  currentSubscription,
  paymentHistory,
  exerciseProblems,
  appSettings,
  contactInfo,
  socialLinks,
  appInfo,
  getCourseById,
  getLessonById,
  getNextLesson,
  getCompletedLessonsCount,
  getTotalLessonsCount,
  getOverallProgress,
  getEarnedAchievements,
  getCurrentWeekActivity,
  getTotalStudyTime,
};