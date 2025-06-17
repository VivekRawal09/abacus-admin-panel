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

const HomeScreen = ({ navigation }) => {
  // Sample data for demo
  const studentName = "Rahul";
  const currentLevel = "Level 2";
  const overallProgress = 65;
  const currentLesson = "Single Digit Addition";
  
  const quickAccessItems = [
    {
      id: 1,
      title: 'Continue Learning',
      subtitle: 'Lesson 2.3: Single Digit Addition',
      icon: 'play-circle',
      color: '#4CAF50',
      onPress: () => navigation.navigate('CourseDetail', { courseId: 2 }),
    },
    {
      id: 2,
      title: 'Practice Abacus',
      subtitle: 'Free practice mode',
      icon: 'calculator',
      color: '#2196F3',
      onPress: () => navigation.navigate('PracticeAbacus'),
    },
    {
      id: 3,
      title: 'View Progress',
      subtitle: 'Track your learning',
      icon: 'bar-chart',
      color: '#FF9800',
      onPress: () => navigation.navigate('Progress'),
    },
    {
      id: 4,
      title: 'Browse Courses',
      subtitle: 'Explore all levels',
      icon: 'book',
      color: '#9C27B0',
      onPress: () => navigation.navigate('Courses'),
    },
  ];

  const recentAchievements = [
    {
      id: 1,
      title: 'Level 1 Completed!',
      description: 'Mastered basic numbers',
      icon: 'trophy',
      date: '2 days ago',
      color: '#FFD700',
    },
    {
      id: 2,
      title: 'First 100 Points',
      description: 'Keep up the great work!',
      icon: 'star',
      date: '1 week ago',
      color: '#FF6B6B',
    },
    {
      id: 3,
      title: 'Daily Streak - 7 days',
      description: 'Consistent learning habit',
      icon: 'flame',
      date: '3 days ago',
      color: '#FF5722',
    },
  ];

  const renderQuickAccessCard = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.quickAccessCard, { borderLeftColor: item.color }]}
      onPress={item.onPress}
    >
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
          <Ionicons name={item.icon} size={24} color={item.color} />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  );

  const renderAchievement = (achievement) => (
    <View key={achievement.id} style={styles.achievementCard}>
      <View style={[styles.achievementIcon, { backgroundColor: achievement.color + '20' }]}>
        <Ionicons name={achievement.icon} size={20} color={achievement.color} />
      </View>
      <View style={styles.achievementContent}>
        <Text style={styles.achievementTitle}>{achievement.title}</Text>
        <Text style={styles.achievementDescription}>{achievement.description}</Text>
        <Text style={styles.achievementDate}>{achievement.date}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.studentName}>{studentName}! 👋</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={24} color="#666" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Current Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressInfo}>
              <Text style={styles.currentLevel}>Currently Learning</Text>
              <Text style={styles.levelName}>{currentLevel}</Text>
              <Text style={styles.currentLesson}>{currentLesson}</Text>
            </View>
            <View style={styles.progressCircle}>
              <View style={styles.progressCircleInner}>
                <Text style={styles.progressPercentage}>{overallProgress}%</Text>
                <Text style={styles.progressLabel}>Complete</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Access Section */}
        <View style={styles.quickAccessSection}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          {quickAccessItems.map(renderQuickAccessCard)}
        </View>

        {/* Recent Achievements Section */}
        <View style={styles.achievementsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Achievements</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {recentAchievements.map(renderAchievement)}
        </View>

        {/* Daily Tip Section */}
        <View style={styles.tipSection}>
          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Ionicons name="bulb" size={20} color="#FFB74D" />
              <Text style={styles.tipTitle}>Today's Tip</Text>
            </View>
            <Text style={styles.tipText}>
              Practice for just 15 minutes daily to see significant improvement in your abacus skills!
            </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  studentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FF5252',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  progressSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressInfo: {
    flex: 1,
  },
  currentLevel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  levelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  currentLesson: {
    fontSize: 14,
    color: '#666',
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircleInner: {
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressLabel: {
    fontSize: 10,
    color: '#fff',
    marginTop: 2,
  },
  quickAccessSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  quickAccessCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  achievementsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
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
  achievementCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  achievementIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  achievementDate: {
    fontSize: 12,
    color: '#999',
  },
  tipSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tipCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFD54F',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8F00',
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#FF8F00',
    lineHeight: 20,
  },
});

export default HomeScreen;