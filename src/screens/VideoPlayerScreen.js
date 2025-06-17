import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const VideoPlayerScreen = ({ navigation, route }) => {
  const { 
    lessonId, 
    lessonTitle, 
    videoId, 
    courseId, 
    courseTitle 
  } = route.params;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(480); // 8 minutes demo duration
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Demo lesson data
  const lessonData = {
    lessonId,
    title: lessonTitle,
    description: 'Learn the fundamentals of single digit addition using abacus techniques.',
    instructor: 'Prof. Rajesh Kumar',
    duration: '8:00',
    views: 1247,
    likes: 98,
  };

  useEffect(() => {
    // Hide status bar when component mounts
    StatusBar.setHidden(true);
    
    return () => {
      // Reset orientation and status bar when component unmounts
      const resetOrientation = async () => {
        try {
          // Use PORTRAIT_UP instead of PORTRAIT for iOS compatibility
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
          StatusBar.setHidden(false);
        } catch (error) {
          console.log('Orientation reset failed, trying unlock:', error);
          // Fallback: try unlocking orientation instead
          try {
            await ScreenOrientation.unlockAsync();
            StatusBar.setHidden(false);
          } catch (unlockError) {
            console.log('Orientation unlock failed:', unlockError);
          }
        }
      };
      resetOrientation();
    };
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleFullscreen = async () => {
    try {
      if (isFullscreen) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      } else {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      }
      setIsFullscreen(!isFullscreen);
    } catch (error) {
      console.log('Orientation change failed:', error);
      // Fallback: still toggle fullscreen state even if orientation fails
      setIsFullscreen(!isFullscreen);
    }
  };

  const changeSpeed = () => {
    const speeds = [0.5, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  const seekTo = (newTime) => {
    setCurrentTime(Math.max(0, Math.min(newTime, duration)));
  };

  const skip = (seconds) => {
    seekTo(currentTime + seconds);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    Alert.alert(
      'Next Lesson',
      'Would you like to continue to the next lesson?',
      [
        { text: 'Stay Here', style: 'cancel' },
        { 
          text: 'Next Lesson', 
          onPress: () => {
            // In real app, navigate to next lesson
            Alert.alert('Demo', 'Next lesson functionality not implemented in demo');
          }
        },
      ]
    );
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    Alert.alert(
      'Bookmark',
      isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks'
    );
  };

  const progressPercentage = (currentTime / duration) * 100;

  return (
    <SafeAreaView style={[styles.container, isFullscreen && styles.fullscreenContainer]}>
      {/* Header */}
      {!isFullscreen && (
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {lessonTitle}
            </Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {courseTitle}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={handleBookmark}
          >
            <Ionicons 
              name={isBookmarked ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color="#fff" 
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Video Player Area */}
      <View style={[styles.videoContainer, isFullscreen && styles.fullscreenVideo]}>
        <TouchableOpacity
          style={styles.videoPlayer}
          onPress={() => setShowControls(!showControls)}
          activeOpacity={1}
        >
          {/* Video Placeholder */}
          <View style={styles.videoPlaceholder}>
            <Ionicons name="videocam" size={60} color="#666" />
            <Text style={styles.videoPlaceholderText}>Video Player</Text>
            <Text style={styles.demoText}>Demo: {lessonTitle}</Text>
          </View>

          {/* Video Controls Overlay */}
          {showControls && (
            <View style={styles.controlsOverlay}>
              {/* Top Controls */}
              {isFullscreen && (
                <View style={styles.topControls}>
                  <TouchableOpacity
                    style={styles.fullscreenBackButton}
                    onPress={() => navigation.goBack()}
                  >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.fullscreenTitle}>{lessonTitle}</Text>
                </View>
              )}

              {/* Center Controls */}
              <View style={styles.centerControls}>
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={() => skip(-10)}
                >
                  <Ionicons name="play-back" size={30} color="#fff" />
                  <Text style={styles.skipText}>10</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.playButton}
                  onPress={togglePlay}
                >
                  <Ionicons 
                    name={isPlaying ? "pause" : "play"} 
                    size={50} 
                    color="#fff" 
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={() => skip(10)}
                >
                  <Ionicons name="play-forward" size={30} color="#fff" />
                  <Text style={styles.skipText}>10</Text>
                </TouchableOpacity>
              </View>

              {/* Bottom Controls */}
              <View style={styles.bottomControls}>
                <Text style={styles.timeText}>
                  {formatTime(currentTime)}
                </Text>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${progressPercentage}%` }
                      ]} 
                    />
                  </View>
                </View>

                <Text style={styles.timeText}>
                  {formatTime(duration)}
                </Text>

                <TouchableOpacity
                  style={styles.speedButton}
                  onPress={changeSpeed}
                >
                  <Text style={styles.speedText}>{playbackSpeed}x</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.fullscreenButton}
                  onPress={toggleFullscreen}
                >
                  <Ionicons 
                    name={isFullscreen ? "contract" : "expand"} 
                    size={20} 
                    color="#fff" 
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Content Below Video (Portrait Only) */}
      {!isFullscreen && (
        <View style={styles.content}>
          {/* Lesson Info */}
          <View style={styles.lessonInfo}>
            <Text style={styles.lessonTitle}>{lessonData.title}</Text>
            <Text style={styles.lessonDescription}>
              {lessonData.description}
            </Text>
            
            <View style={styles.lessonStats}>
              <View style={styles.statItem}>
                <Ionicons name="person" size={16} color="#666" />
                <Text style={styles.statText}>{lessonData.instructor}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="eye" size={16} color="#666" />
                <Text style={styles.statText}>{lessonData.views} views</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="thumbs-up" size={16} color="#666" />
                <Text style={styles.statText}>{lessonData.likes} likes</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="thumbs-up-outline" size={20} color="#4CAF50" />
              <Text style={styles.actionButtonText}>Like</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-outline" size={20} color="#4CAF50" />
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="download-outline" size={20} color="#4CAF50" />
              <Text style={styles.actionButtonText}>Download</Text>
            </TouchableOpacity>
          </View>

          {/* Next Lesson */}
          <View style={styles.nextLessonSection}>
            <TouchableOpacity
              style={styles.nextLessonButton}
              onPress={handleNext}
            >
              <View style={styles.nextLessonContent}>
                <Text style={styles.nextLessonLabel}>Up Next</Text>
                <Text style={styles.nextLessonTitle}>
                  Practice Exercises - Addition
                </Text>
              </View>
              <Ionicons name="play-circle" size={40} color="#4CAF50" />
            </TouchableOpacity>
          </View>

          {/* Course Navigation */}
          <View style={styles.courseNavigation}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="list" size={20} color="#4CAF50" />
              <Text style={styles.navButtonText}>Course Lessons</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullscreenContainer: {
    backgroundColor: '#000',
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
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E8F5E8',
  },
  bookmarkButton: {
    padding: 8,
    marginLeft: 8,
  },
  videoContainer: {
    height: 220,
    backgroundColor: '#000',
  },
  fullscreenVideo: {
    flex: 1,
    height: '100%',
  },
  videoPlayer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    alignItems: 'center',
  },
  videoPlaceholderText: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
  },
  demoText: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  fullscreenBackButton: {
    padding: 8,
    marginRight: 12,
  },
  fullscreenTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  skipText: {
    color: '#fff',
    fontSize: 12,
    marginTop: -5,
  },
  playButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 40,
    padding: 15,
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  timeText: {
    color: '#fff',
    fontSize: 14,
    minWidth: 40,
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  speedButton: {
    marginHorizontal: 8,
    paddingHorizontal: 8,
  },
  speedText: {
    color: '#fff',
    fontSize: 14,
  },
  fullscreenButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  lessonInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  lessonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  lessonDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
  lessonStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  actionButtons: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
    fontWeight: '500',
  },
  nextLessonSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 8,
  },
  nextLessonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  nextLessonContent: {
    flex: 1,
  },
  nextLessonLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  nextLessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  courseNavigation: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 8,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
  },
  navButtonText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default VideoPlayerScreen;