import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CourseDetailScreen = ({ navigation, route }) => {
  const { courseId, courseTitle } = route.params;

  // Sample course data with lessons
  const courseData = {
    1: {
      id: 1,
      title: 'Level 1: Basic Numbers',
      description: 'Master the fundamentals of abacus with basic number recognition and bead movement techniques.',
      totalDuration: '2 hours 15 minutes',
      difficulty: 'Beginner',
      progress: 100,
      instructor: 'Prof. Rajesh Kumar',
      enrolled: 1247,
      rating: 4.8,
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
    2: {
      id: 2,
      title: 'Level 2: Simple Addition',
      description: 'Learn single-digit addition techniques using abacus with step-by-step guidance and practice exercises.',
      totalDuration: '3 hours 45 minutes',
      difficulty: 'Beginner',
      progress: 60,
      instructor: 'Prof. Rajesh Kumar',
      enrolled: 892,
      rating: 4.7,
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
    }
  };

  const course = courseData[courseId] || courseData[2]; // Default to course 2 if not found

  const handleLessonPress = (lesson) => {
    if (!lesson.completed && lesson.id > getLastCompletedLessonId() + 1) {
      Alert.alert(
        'Lesson Locked',
        'Please complete the previous lessons first.',
        [{ text: 'OK' }]
      );
      return;
    }

    navigation.navigate('VideoPlayer', {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      videoId: lesson.videoId,
      courseId: course.id,
      courseTitle: course.title
    });
  };

  const getLastCompletedLessonId = () => {
    let lastCompleted = 0;
    course.lessons.forEach(lesson => {
      if (lesson.completed) {
        lastCompleted = lesson.id;
      }
    });
    return lastCompleted;
  };

  const getNextLesson = () => {
    return course.lessons.find(lesson => !lesson.completed);
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View 
          style={[styles.progressFill, { width: `${course.progress}%` }]} 
        />
      </View>
      <Text style={styles.progressText}>{course.progress}%</Text>
    </View>
  );

  const renderLesson = (lesson, index) => {
    const isLocked = !lesson.completed && lesson.id > getLastCompletedLessonId() + 1;
    const isNext = lesson.id === getLastCompletedLessonId() + 1 && !lesson.completed;

    return (
      <TouchableOpacity
        key={lesson.id}
        style={[
          styles.lessonCard,
          lesson.completed && styles.lessonCompleted,
          isNext && styles.lessonNext,
          isLocked && styles.lessonLocked
        ]}
        onPress={() => handleLessonPress(lesson)}
        disabled={isLocked}
      >
        <View style={styles.lessonNumber}>
          <Text style={[
            styles.lessonNumberText,
            lesson.completed && styles.lessonNumberTextCompleted,
            isNext && styles.lessonNumberTextNext
          ]}>
            {index + 1}
          </Text>
        </View>

        <View style={styles.lessonContent}>
          <View style={styles.lessonHeader}>
            <Text style={[
              styles.lessonTitle,
              isLocked && styles.lockedText
            ]}>
              {lesson.title}
            </Text>
            <View style={styles.lessonMeta}>
              <Ionicons 
                name={lesson.type === 'quiz' ? 'help-circle' : 'play-circle'} 
                size={16} 
                color="#666" 
              />
              <Text style={styles.lessonDuration}>{lesson.duration}</Text>
            </View>
          </View>
          <Text style={[
            styles.lessonDescription,
            isLocked && styles.lockedText
          ]}>
            {lesson.description}
          </Text>
        </View>

        <View style={styles.lessonStatus}>
          {lesson.completed && (
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          )}
          {isNext && (
            <Ionicons name="play-circle" size={24} color="#2196F3" />
          )}
          {isLocked && (
            <Ionicons name="lock-closed" size={24} color="#999" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const nextLesson = getNextLesson();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {course.title}
        </Text>
        <TouchableOpacity style={styles.bookmarkButton}>
          <Ionicons name="bookmark-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Course Info Section */}
        <View style={styles.courseInfo}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.courseDescription}>{course.description}</Text>
          
          <View style={styles.courseStats}>
            <View style={styles.statItem}>
              <Ionicons name="time" size={16} color="#666" />
              <Text style={styles.statText}>{course.totalDuration}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="school" size={16} color="#666" />
              <Text style={styles.statText}>{course.difficulty}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people" size={16} color="#666" />
              <Text style={styles.statText}>{course.enrolled} students</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.statText}>{course.rating}</Text>
            </View>
          </View>

          <Text style={styles.instructor}>Instructor: {course.instructor}</Text>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          {renderProgressBar()}
          <Text style={styles.progressDescription}>
            {course.lessons.filter(l => l.completed).length} of {course.lessons.length} lessons completed
          </Text>
        </View>

        {/* Continue Learning Button */}
        {nextLesson && (
          <View style={styles.continueSection}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => handleLessonPress(nextLesson)}
            >
              <Ionicons name="play" size={20} color="#fff" />
              <Text style={styles.continueButtonText}>
                Continue: {nextLesson.title}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Lessons Section */}
        <View style={styles.lessonsSection}>
          <Text style={styles.sectionTitle}>Course Lessons</Text>
          {course.lessons.map((lesson, index) => renderLesson(lesson, index))}
        </View>

        {/* Course Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="download" size={20} color="#4CAF50" />
            <Text style={styles.actionButtonText}>Download for Offline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share" size={20} color="#4CAF50" />
            <Text style={styles.actionButtonText}>Share Course</Text>
          </TouchableOpacity>
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
  header: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 44,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  bookmarkButton: {
    padding: 8,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  courseInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
  courseStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  instructor: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  progressSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  progressDescription: {
    fontSize: 14,
    color: '#666',
  },
  continueSection: {
    padding: 20,
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  lessonsSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 8,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lessonCompleted: {
    backgroundColor: '#f8f9fa',
  },
  lessonNext: {
    backgroundColor: '#e3f2fd',
  },
  lessonLocked: {
    opacity: 0.5,
  },
  lessonNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lessonNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  lessonNumberTextCompleted: {
    color: '#4CAF50',
  },
  lessonNumberTextNext: {
    color: '#2196F3',
  },
  lessonContent: {
    flex: 1,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonDuration: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  lessonDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  lockedText: {
    color: '#999',
  },
  lessonStatus: {
    marginLeft: 12,
  },
  actionsSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#4CAF50',
    marginLeft: 12,
    fontWeight: '500',
  },
});

export default CourseDetailScreen;