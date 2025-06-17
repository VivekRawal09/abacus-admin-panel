import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ProgressScreen = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // 'week', 'month', 'all'

  // Sample progress data
  const overallStats = {
    totalTimeSpent: '47h 32m',
    lessonsCompleted: 12,
    totalLessons: 28,
    currentStreak: 7,
    longestStreak: 15,
    averageSessionTime: '24 minutes',
    skillLevel: 'Intermediate',
    nextMilestone: 'Complete Level 3',
  };

  const courseProgress = [
    {
      id: 1,
      title: 'Level 1: Basic Numbers',
      progress: 100,
      status: 'completed',
      timeSpent: '8h 15m',
      completedDate: '2024-05-15',
      certificate: true,
      lessons: 3,
      completedLessons: 3,
      color: '#4CAF50',
    },
    {
      id: 2,
      title: 'Level 2: Simple Addition',
      progress: 60,
      status: 'in_progress',
      timeSpent: '12h 45m',
      completedDate: null,
      certificate: false,
      lessons: 5,
      completedLessons: 3,
      color: '#2196F3',
    },
    {
      id: 3,
      title: 'Level 3: Advanced Addition',
      progress: 0,
      status: 'locked',
      timeSpent: '0h 0m',
      completedDate: null,
      certificate: false,
      lessons: 6,
      completedLessons: 0,
      color: '#FF9800',
    },
    {
      id: 4,
      title: 'Level 4: Subtraction',
      progress: 0,
      status: 'locked',
      timeSpent: '0h 0m',
      completedDate: null,
      certificate: false,
      lessons: 5,
      completedLessons: 0,
      color: '#9C27B0',
    },
    {
      id: 5,
      title: 'Level 5: Multiplication',
      progress: 0,
      status: 'locked',
      timeSpent: '0h 0m',
      completedDate: null,
      certificate: false,
      lessons: 7,
      completedLessons: 0,
      color: '#F44336',
    },
  ];

  const achievements = [
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
  ];

  const weeklyActivity = [
    { day: 'Mon', minutes: 25, lessons: 1 },
    { day: 'Tue', minutes: 30, lessons: 2 },
    { day: 'Wed', minutes: 0, lessons: 0 },
    { day: 'Thu', minutes: 45, lessons: 2 },
    { day: 'Fri', minutes: 20, lessons: 1 },
    { day: 'Sat', minutes: 35, lessons: 1 },
    { day: 'Sun', minutes: 40, lessons: 2 },
  ];

  const renderProgressBar = (progress, color = '#4CAF50') => (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${progress}%`, backgroundColor: color }
          ]} 
        />
      </View>
      <Text style={styles.progressPercentage}>{progress}%</Text>
    </View>
  );

  const renderOverallStats = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.sectionTitle}>Overall Progress</Text>
      
      <View style={styles.overallProgressCard}>
        <View style={styles.progressCircle}>
          <View style={styles.progressCircleInner}>
            <Text style={styles.progressCircleText}>
              {Math.round((overallStats.lessonsCompleted / overallStats.totalLessons) * 100)}%
            </Text>
            <Text style={styles.progressCircleLabel}>Complete</Text>
          </View>
        </View>
        
        <View style={styles.overallStatsText}>
          <Text style={styles.skillLevel}>{overallStats.skillLevel}</Text>
          <Text style={styles.lessonsProgress}>
            {overallStats.lessonsCompleted} of {overallStats.totalLessons} lessons
          </Text>
          <Text style={styles.timeSpent}>
            Total time: {overallStats.totalTimeSpent}
          </Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="flame" size={24} color="#FF5722" />
          <Text style={styles.statNumber}>{overallStats.currentStreak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="time" size={24} color="#2196F3" />
          <Text style={styles.statNumber}>{overallStats.averageSessionTime}</Text>
          <Text style={styles.statLabel}>Avg Session</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="trophy" size={24} color="#FFD700" />
          <Text style={styles.statNumber}>{achievements.filter(a => a.earned).length}</Text>
          <Text style={styles.statLabel}>Achievements</Text>
        </View>
      </View>
    </View>
  );

  const renderCourseProgress = () => (
    <View style={styles.courseProgressContainer}>
      <Text style={styles.sectionTitle}>Course Progress</Text>
      
      {courseProgress.map((course) => (
        <View key={course.id} style={styles.courseProgressCard}>
          <View style={styles.courseProgressHeader}>
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.courseStats}>
                {course.completedLessons}/{course.lessons} lessons • {course.timeSpent}
              </Text>
            </View>
            
            {course.certificate && (
              <TouchableOpacity style={styles.certificateButton}>
                <Ionicons name="ribbon" size={20} color="#FFD700" />
              </TouchableOpacity>
            )}
          </View>
          
          {renderProgressBar(course.progress, course.color)}
          
          <View style={styles.courseProgressFooter}>
            <Text style={[styles.courseStatus, { color: course.color }]}>
              {course.status === 'completed' ? 'Completed' :
               course.status === 'in_progress' ? 'In Progress' : 'Locked'}
            </Text>
            {course.completedDate && (
              <Text style={styles.completedDate}>
                Completed: {new Date(course.completedDate).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );

  const renderWeeklyActivity = () => (
    <View style={styles.activityContainer}>
      <Text style={styles.sectionTitle}>Weekly Activity</Text>
      
      <View style={styles.activityChart}>
        {weeklyActivity.map((day, index) => (
          <View key={index} style={styles.dayColumn}>
            <View style={styles.activityBar}>
              <View 
                style={[
                  styles.activityFill,
                  { 
                    height: `${(day.minutes / 50) * 100}%`,
                    backgroundColor: day.minutes > 0 ? '#4CAF50' : '#E0E0E0'
                  }
                ]} 
              />
            </View>
            <Text style={styles.dayLabel}>{day.day}</Text>
            <Text style={styles.minutesLabel}>{day.minutes}m</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.achievementsContainer}>
      <View style={styles.achievementsHeader}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.achievementsGrid}>
        {achievements.slice(0, 6).map((achievement) => (
          <TouchableOpacity 
            key={achievement.id} 
            style={[
              styles.achievementCard,
              !achievement.earned && styles.achievementCardLocked
            ]}
          >
            <View style={[
              styles.achievementIcon,
              { backgroundColor: achievement.color + '20' }
            ]}>
              <Ionicons 
                name={achievement.icon} 
                size={20} 
                color={achievement.earned ? achievement.color : '#999'} 
              />
            </View>
            <Text style={[
              styles.achievementTitle,
              !achievement.earned && styles.achievementTitleLocked
            ]}>
              {achievement.title}
            </Text>
            {achievement.earned && (
              <View style={styles.earnedBadge}>
                <Ionicons name="checkmark" size={12} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Progress</Text>
          <Text style={styles.headerSubtitle}>Track your learning journey</Text>
        </View>

        {renderOverallStats()}
        {renderCourseProgress()}
        {renderWeeklyActivity()}
        {renderAchievements()}

        {/* Next Milestone */}
        <View style={styles.milestoneContainer}>
          <View style={styles.milestoneCard}>
            <Ionicons name="flag" size={24} color="#4CAF50" />
            <View style={styles.milestoneContent}>
              <Text style={styles.milestoneTitle}>Next Milestone</Text>
              <Text style={styles.milestoneDescription}>
                {overallStats.nextMilestone}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsContainer: {
    backgroundColor: '#fff',
    margin: 20,
    marginBottom: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overallProgressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  progressCircleInner: {
    alignItems: 'center',
  },
  progressCircleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressCircleLabel: {
    fontSize: 10,
    color: '#fff',
    marginTop: 2,
  },
  overallStatsText: {
    flex: 1,
  },
  skillLevel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  lessonsProgress: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  timeSpent: {
    fontSize: 14,
    color: '#666',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  courseProgressContainer: {
    backgroundColor: '#fff',
    margin: 20,
    marginBottom: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseProgressCard: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  courseProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  courseStats: {
    fontSize: 14,
    color: '#666',
  },
  certificateButton: {
    padding: 4,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressPercentage: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    minWidth: 30,
  },
  courseProgressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  completedDate: {
    fontSize: 12,
    color: '#999',
  },
  activityContainer: {
    backgroundColor: '#fff',
    margin: 20,
    marginBottom: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  activityBar: {
    width: 20,
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  activityFill: {
    width: '100%',
    borderRadius: 10,
  },
  dayLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  minutesLabel: {
    fontSize: 10,
    color: '#999',
  },
  achievementsContainer: {
    backgroundColor: '#fff',
    margin: 20,
    marginBottom: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: (width - 80) / 3,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  achievementCardLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  achievementTitleLocked: {
    color: '#999',
  },
  earnedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  milestoneContainer: {
    margin: 20,
    marginBottom: 40,
  },
  milestoneCard: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  milestoneContent: {
    flex: 1,
    marginLeft: 12,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  milestoneDescription: {
    fontSize: 14,
    color: '#2E7D32',
  },
});

export default ProgressScreen;