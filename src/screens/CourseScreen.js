import React from 'react';
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

const CoursesScreen = ({ navigation }) => {
  // Sample course data
  const courseLevels = [
    {
      id: 1,
      title: 'Level 1: Basic Numbers',
      description: 'Learn basic number recognition and bead movement',
      progress: 100,
      status: 'completed',
      totalLessons: 3,
      completedLessons: 3,
      duration: '2 hours',
      difficulty: 'Beginner',
      color: '#4CAF50',
      icon: 'checkmark-circle',
    },
    {
      id: 2,
      title: 'Level 2: Simple Addition',
      description: 'Master single-digit addition using abacus',
      progress: 60,
      status: 'in_progress',
      totalLessons: 5,
      completedLessons: 3,
      duration: '3.5 hours',
      difficulty: 'Beginner',
      color: '#2196F3',
      icon: 'play-circle',
    },
    {
      id: 3,
      title: 'Level 3: Advanced Addition',
      description: 'Learn multi-digit addition techniques',
      progress: 0,
      status: 'locked',
      totalLessons: 6,
      completedLessons: 0,
      duration: '4 hours',
      difficulty: 'Intermediate',
      color: '#FF9800',
      icon: 'lock-closed',
    },
    {
      id: 4,
      title: 'Level 4: Subtraction',
      description: 'Master subtraction with borrowing',
      progress: 0,
      status: 'locked',
      totalLessons: 5,
      completedLessons: 0,
      duration: '3.5 hours',
      difficulty: 'Intermediate',
      color: '#9C27B0',
      icon: 'lock-closed',
    },
    {
      id: 5,
      title: 'Level 5: Multiplication',
      description: 'Learn multiplication techniques',
      progress: 0,
      status: 'locked',
      totalLessons: 7,
      completedLessons: 0,
      duration: '5 hours',
      difficulty: 'Advanced',
      color: '#F44336',
      icon: 'lock-closed',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'in_progress':
        return '#2196F3';
      case 'locked':
        return '#999';
      default:
        return '#999';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'locked':
        return 'Locked';
      default:
        return 'Unknown';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return '#4CAF50';
      case 'Intermediate':
        return '#FF9800';
      case 'Advanced':
        return '#F44336';
      default:
        return '#999';
    }
  };

  const handleCoursePress = (course) => {
    if (course.status === 'locked') {
      return;
    }
    navigation.navigate('CourseDetail', { 
      courseId: course.id,
      courseTitle: course.title 
    });
  };

  const renderProgressBar = (progress) => (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${progress}%` }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>{progress}%</Text>
    </View>
  );

  const renderCourseCard = (course) => (
    <TouchableOpacity
      key={course.id}
      style={[
        styles.courseCard,
        course.status === 'locked' && styles.courseCardLocked
      ]}
      onPress={() => handleCoursePress(course)}
      disabled={course.status === 'locked'}
    >
      <View style={styles.courseHeader}>
        <View style={[styles.courseIcon, { backgroundColor: course.color + '20' }]}>
          <Ionicons 
            name={course.icon} 
            size={24} 
            color={course.status === 'locked' ? '#999' : course.color} 
          />
        </View>
        <View style={styles.courseInfo}>
          <Text style={[
            styles.courseTitle,
            course.status === 'locked' && styles.lockedText
          ]}>
            {course.title}
          </Text>
          <Text style={[
            styles.courseDescription,
            course.status === 'locked' && styles.lockedText
          ]}>
            {course.description}
          </Text>
        </View>
      </View>

      <View style={styles.courseDetails}>
        <View style={styles.courseStats}>
          <View style={styles.statItem}>
            <Ionicons name="play" size={16} color="#666" />
            <Text style={styles.statText}>
              {course.completedLessons}/{course.totalLessons} lessons
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time" size={16} color="#666" />
            <Text style={styles.statText}>{course.duration}</Text>
          </View>
        </View>

        <View style={styles.courseMeta}>
          <View style={[
            styles.difficultyBadge,
            { backgroundColor: getDifficultyColor(course.difficulty) + '20' }
          ]}>
            <Text style={[
              styles.difficultyText,
              { color: getDifficultyColor(course.difficulty) }
            ]}>
              {course.difficulty}
            </Text>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(course.status) + '20' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: getStatusColor(course.status) }
            ]}>
              {getStatusText(course.status)}
            </Text>
          </View>
        </View>
      </View>

      {course.status !== 'locked' && renderProgressBar(course.progress)}

      {course.status === 'locked' && (
        <View style={styles.lockedOverlay}>
          <Text style={styles.lockedMessage}>
            Complete previous level to unlock
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Courses</Text>
          <Text style={styles.headerSubtitle}>
            Continue your abacus learning journey
          </Text>
        </View>

        {/* Overall Progress */}
        <View style={styles.overallProgress}>
          <Text style={styles.progressTitle}>Overall Progress</Text>
          <View style={styles.overallProgressBar}>
            <View style={styles.overallProgressFill} />
          </View>
          <Text style={styles.overallProgressText}>2 of 5 levels completed</Text>
        </View>

        {/* Course List */}
        <View style={styles.courseList}>
          <Text style={styles.sectionTitle}>Available Courses</Text>
          {courseLevels.map(renderCourseCard)}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#2196F3" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Learning Path</Text>
              <Text style={styles.infoText}>
                Complete each level in order to unlock the next one. Each level builds on the previous skills.
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
  overallProgress: {
    backgroundColor: '#fff',
    margin: 20,
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
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  overallProgressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
  },
  overallProgressFill: {
    height: '100%',
    width: '40%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  overallProgressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  courseList: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseCardLocked: {
    opacity: 0.6,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  courseIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  lockedText: {
    color: '#999',
  },
  courseDetails: {
    marginBottom: 12,
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  courseMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  lockedOverlay: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  lockedMessage: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  infoSection: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
});

export default CoursesScreen;