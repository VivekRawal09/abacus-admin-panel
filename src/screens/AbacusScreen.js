import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  StatusBar,
  Animated,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useFocusEffect } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Animated Bead Component with spring animation
const AnimatedBead = ({ isActive, size, isHeaven, onPress }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const positionAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Scale animation for feedback
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: isActive ? 1.1 : 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Position animation for bead movement
    Animated.spring(positionAnim, {
      toValue: isActive ? (isHeaven ? -8 : 8) : 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [isActive]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View
        style={[
          {
            width: size,
            height: size * (isHeaven ? 1.2 : 1),
            borderRadius: size / 2,
            backgroundColor: isActive ? '#FF6F00' : '#FFD54F',
            borderWidth: 2,
            borderColor: isActive ? '#E65100' : '#F57F17',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 2,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          },
          {
            transform: [
              { scale: scaleAnim },
              { translateY: positionAnim },
            ],
          },
        ]}
      >
        <View style={{
          width: size * 0.3,
          height: size * 0.3,
          borderRadius: size * 0.15,
          backgroundColor: 'rgba(0,0,0,0.2)',
        }} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const AbacusScreen = ({ navigation }) => {
  const [isLandscape, setIsLandscape] = useState(false);
  const [currentValue, setCurrentValue] = useState(0);
  const [mode, setMode] = useState('free');
  const [exerciseMode, setExerciseMode] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [score, setScore] = useState(0);
  const [problemHistory, setProblemHistory] = useState([]);
  const [screenDimensions, setScreenDimensions] = useState({ 
    width: screenWidth, 
    height: screenHeight 
  });
  
  // Corrected Abacus state - 9 columns with proper positioning
  const [abacusState, setAbacusState] = useState({
    0: { heaven: false, earth: [false, false, false, false], value: 0 },
    1: { heaven: false, earth: [false, false, false, false], value: 0 },
    2: { heaven: false, earth: [false, false, false, false], value: 0 },
    3: { heaven: false, earth: [false, false, false, false], value: 0 },
    4: { heaven: false, earth: [false, false, false, false], value: 0 },
    5: { heaven: false, earth: [false, false, false, false], value: 0 },
    6: { heaven: false, earth: [false, false, false, false], value: 0 },
    7: { heaven: false, earth: [false, false, false, false], value: 0 },
    8: { heaven: false, earth: [false, false, false, false], value: 0 },
  });

  const exerciseProblems = [
    { question: "5 + 3", answer: 8, difficulty: 'Easy' },
    { question: "7 + 2", answer: 9, difficulty: 'Easy' },
    { question: "4 + 6", answer: 10, difficulty: 'Easy' },
    { question: "12 + 8", answer: 20, difficulty: 'Medium' },
    { question: "15 + 7", answer: 22, difficulty: 'Medium' },
    { question: "25 + 17", answer: 42, difficulty: 'Medium' },
    { question: "34 × 2", answer: 68, difficulty: 'Hard' },
    { question: "48 ÷ 6", answer: 8, difficulty: 'Hard' },
    { question: "67 - 28", answer: 39, difficulty: 'Medium' },
    { question: "93 + 47", answer: 140, difficulty: 'Hard' },
  ];

  const sidebarAnimation = React.useRef(new Animated.Value(0)).current;

  // Listen for dimension changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  // Correct abacus calculation with proper place values - matching Android logic
  const calculateValue = () => {
    let total = 0;
    const centerIndex = 4; // Units column index
    
    Object.keys(abacusState).forEach((columnIndex) => {
      const column = abacusState[columnIndex];
      const colIndex = parseInt(columnIndex);
      
      // Calculate power based on distance from center (units column)
      const power = centerIndex - colIndex;
      const multiplier = Math.pow(10, power);
      
      // Calculate column value (heaven bead = 5, each earth bead = 1)
      let columnValue = 0;
      if (column.heaven) columnValue += 5;
      column.earth.forEach((bead) => {
        if (bead) columnValue += 1;
      });
      
      total += columnValue * multiplier;
    });
    
    setCurrentValue(total);
    return total;
  };

  const calculateRodValue = (state) => {
    let value = 0;
    if (state.heaven) value += 5;
    state.earth.forEach((bead) => {
      if (bead) value += 1;
    });
    return value;
  };

  const toggleHeavenBead = (columnIndex) => {
    setAbacusState(prev => {
      const newState = {
        ...prev,
        [columnIndex]: {
          ...prev[columnIndex],
          heaven: !prev[columnIndex].heaven
        }
      };
      newState[columnIndex].value = calculateRodValue(newState[columnIndex]);
      
      // Calculate total value immediately
      let total = 0;
      const centerIndex = 4;
      Object.keys(newState).forEach((colIndex) => {
        const column = newState[colIndex];
        const power = centerIndex - parseInt(colIndex);
        const multiplier = Math.pow(10, power);
        total += column.value * multiplier;
      });
      setCurrentValue(total);
      
      return newState;
    });
  };

  const toggleEarthBead = (columnIndex, beadIndex) => {
    setAbacusState(prev => {
      const newEarthBeads = [...prev[columnIndex].earth];
      const currentBeadState = newEarthBeads[beadIndex];
      
      // Apply the exact same logic as the Android code
      for (let i = 0; i < 4; i++) {
        if (i < beadIndex) {
          newEarthBeads[i] = true;
        } else if (i > beadIndex) {
          newEarthBeads[i] = false;
        } else {
          newEarthBeads[i] = !currentBeadState;
        }
      }
      
      const newState = {
        ...prev,
        [columnIndex]: {
          ...prev[columnIndex],
          earth: newEarthBeads
        }
      };
      newState[columnIndex].value = calculateRodValue(newState[columnIndex]);
      
      // Calculate total value immediately
      let total = 0;
      const centerIndex = 4;
      Object.keys(newState).forEach((colIndex) => {
        const column = newState[colIndex];
        const power = centerIndex - parseInt(colIndex);
        const multiplier = Math.pow(10, power);
        total += column.value * multiplier;
      });
      setCurrentValue(total);
      
      return newState;
    });
  };

  const resetAbacus = () => {
    setAbacusState({
      0: { heaven: false, earth: [false, false, false, false], value: 0 },
      1: { heaven: false, earth: [false, false, false, false], value: 0 },
      2: { heaven: false, earth: [false, false, false, false], value: 0 },
      3: { heaven: false, earth: [false, false, false, false], value: 0 },
      4: { heaven: false, earth: [false, false, false, false], value: 0 },
      5: { heaven: false, earth: [false, false, false, false], value: 0 },
      6: { heaven: false, earth: [false, false, false, false], value: 0 },
      7: { heaven: false, earth: [false, false, false, false], value: 0 },
      8: { heaven: false, earth: [false, false, false, false], value: 0 },
    });
    setCurrentValue(0);
  };

  const startExercise = () => {
    setMode('exercise');
    resetAbacus();
    const randomProblem = exerciseProblems[Math.floor(Math.random() * exerciseProblems.length)];
    setExerciseMode(randomProblem);
    if (sidebarWidth > 0) {
      toggleSidebar();
    }
  };

  const nextProblem = () => {
    resetAbacus();
    const randomProblem = exerciseProblems[Math.floor(Math.random() * exerciseProblems.length)];
    setExerciseMode(randomProblem);
  };

  const checkAnswer = () => {
    const isCorrect = Math.abs(currentValue - exerciseMode.answer) < 0.0001;
    
    const result = {
      problem: exerciseMode.question,
      userAnswer: currentValue,
      correctAnswer: exerciseMode.answer,
      isCorrect,
      timestamp: new Date().toLocaleTimeString(),
    };
    
    setProblemHistory(prev => [result, ...prev.slice(0, 4)]);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      Alert.alert(
        'Correct! 🎉',
        `Great job! ${exerciseMode.question} = ${currentValue}`,
        [
          { text: 'Next Problem', onPress: nextProblem },
          { text: 'Free Practice', onPress: () => setMode('free') }
        ]
      );
    } else {
      Alert.alert(
        'Try Again',
        `${exerciseMode.question} = ${exerciseMode.answer}, you got ${currentValue}`,
        [{ text: 'OK' }]
      );
    }
  };

  const toggleSidebar = () => {
    const newWidth = sidebarWidth === 0 ? 0.6 : 0;
    setSidebarWidth(newWidth);
    
    Animated.timing(sidebarAnimation, {
      toValue: newWidth,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const getFullScreenDimensions = () => {
    const { width, height } = screenDimensions;
    const totalColumns = 9;
    
    const sidebarPixelWidth = width * sidebarWidth;
    let availableWidth = width - sidebarPixelWidth;
    
    if (mode === 'exercise') {
      availableWidth = availableWidth * 0.6;
    }
    
    availableWidth = availableWidth * 0.98; // Use more of the available space
    const availableHeight = height * 0.95; // Use more height
    
    const columnWidth = availableWidth / totalColumns;
    const maxBeadSize = Math.min(columnWidth * 0.8, availableHeight / 8);
    
    return {
      beadSize: Math.max(maxBeadSize, 30),
      columnWidth,
      frameHeight: availableHeight,
      sidebarPixelWidth,
      isSmallScreen: width < 700,
    };
  };

  const renderFullScreenAbacusColumn = (columnIndex) => {
    const column = abacusState[columnIndex];
    const { beadSize, columnWidth } = getFullScreenDimensions();
    
    const isUnitsColumn = columnIndex === 4;
    
    return (
      <View key={columnIndex} style={[
        styles.fullScreenAbacusColumn, 
        isUnitsColumn && styles.fullScreenUnitsColumn,
        { width: columnWidth }
      ]}>
        <View style={styles.fullScreenHeavenSection}>
          <AnimatedBead
            isActive={column.heaven}
            size={beadSize}
            isHeaven={true}
            onPress={() => toggleHeavenBead(columnIndex)}
          />
        </View>
        
        <View style={[styles.fullScreenSeparatorBar, { width: columnWidth * 0.8 }]} />
        
        <View style={styles.fullScreenEarthSection}>
          {column.earth.map((isActive, beadIndex) => (
            <AnimatedBead
              key={beadIndex}
              isActive={isActive}
              size={beadSize * 0.85}
              isHeaven={false}
              onPress={() => toggleEarthBead(columnIndex, beadIndex)}
            />
          ))}
        </View>
        
        <View style={[styles.fullScreenVerticalRod, { 
          left: columnWidth / 2 - 2,
          width: 4 
        }]} />
      </View>
    );
  };

  const handleBackPress = async () => {
    try {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      StatusBar.setHidden(false);
      setTimeout(() => {
        navigation.goBack();
      }, 100);
    } catch (error) {
      console.log('Orientation reset failed:', error);
      try {
        await ScreenOrientation.unlockAsync();
        StatusBar.setHidden(false);
      } catch (unlockError) {
        console.log('Orientation unlock failed:', unlockError);
      }
      navigation.goBack();
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const setLandscape = async () => {
        try {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
          StatusBar.setHidden(true);
          setIsLandscape(true);
        } catch (error) {
          console.log('Orientation lock failed:', error);
        }
      };
      
      setLandscape();

      return () => {
        const resetPortrait = async () => {
          try {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            StatusBar.setHidden(false);
            setIsLandscape(false);
          } catch (error) {
            console.log('Portrait lock failed, trying unlock:', error);
            try {
              await ScreenOrientation.unlockAsync();
              StatusBar.setHidden(false);
              setIsLandscape(false);
            } catch (unlockError) {
              console.log('Orientation unlock failed:', unlockError);
            }
          }
        };
        resetPortrait();
      };
    }, [])
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', async (e) => {
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        StatusBar.setHidden(false);
      } catch (error) {
        console.log('Navigation orientation reset failed, trying unlock:', error);
        try {
          await ScreenOrientation.unlockAsync();
          StatusBar.setHidden(false);
        } catch (unlockError) {
          console.log('Navigation orientation unlock failed:', unlockError);
        }
      }
    });

    return () => {
      unsubscribe();
      const resetOrientation = async () => {
        try {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
          StatusBar.setHidden(false);
          setIsLandscape(false);
        } catch (error) {
          console.log('Cleanup orientation reset failed, trying unlock:', error);
          try {
            await ScreenOrientation.unlockAsync();
            StatusBar.setHidden(false);
            setIsLandscreen(false);
          } catch (unlockError) {
            console.log('Cleanup orientation unlock failed:', unlockError);
          }
        }
      };
      resetOrientation();
    };
  }, [navigation]);

  if (!isLandscape) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <Ionicons name="phone-portrait" size={60} color="#4CAF50" />
          <Text style={styles.loadingText}>Rotating to Landscape...</Text>
          <Text style={styles.loadingSubtext}>Please rotate your device</Text>
        </View>
      </View>
    );
  }

  const { sidebarPixelWidth } = getFullScreenDimensions();

  return (
    <View style={styles.container}>
      {/* ONLY show hamburger in free mode - NO OTHER UI elements on abacus area */}
      {mode === 'free' && (
        <TouchableOpacity 
          style={styles.hamburgerButton}
          onPress={toggleSidebar}
        >
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {/* Sliding Sidebar - ONLY for free mode */}
        {mode === 'free' && (
          <Animated.View style={[
            styles.sidebar,
            {
              width: sidebarPixelWidth,
              transform: [{
                translateX: sidebarAnimation.interpolate({
                  inputRange: [0, 0.6],
                  outputRange: [-sidebarPixelWidth, 0],
                })
              }]
            }
          ]}>
            <View style={styles.sidebarContent}>
              <TouchableOpacity style={styles.sidebarBackButton} onPress={handleBackPress}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
                <Text style={styles.sidebarBackText}>Back to Home</Text>
              </TouchableOpacity>

              <Text style={styles.sidebarTitle}>Virtual Abacus</Text>

              <View style={styles.sidebarSection}>
                <Text style={styles.sidebarSectionTitle}>Mode</Text>
                <TouchableOpacity
                  style={[styles.sidebarButton, mode === 'free' && styles.sidebarButtonActive]}
                  onPress={() => { setMode('free'); toggleSidebar(); }}
                >
                  <Ionicons name="calculator" size={20} color={mode === 'free' ? '#4CAF50' : '#fff'} />
                  <Text style={[styles.sidebarButtonText, mode === 'free' && styles.sidebarButtonTextActive]}>
                    Free Practice
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.sidebarButton, mode === 'exercise' && styles.sidebarButtonActive]}
                  onPress={startExercise}
                >
                  <Ionicons name="school" size={20} color={mode === 'exercise' ? '#4CAF50' : '#fff'} />
                  <Text style={[styles.sidebarButtonText, mode === 'exercise' && styles.sidebarButtonTextActive]}>
                    Exercise Mode
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.sidebarSection}>
                <Text style={styles.sidebarSectionTitle}>Actions</Text>
                <TouchableOpacity style={styles.sidebarButton} onPress={() => { resetAbacus(); toggleSidebar(); }}>
                  <Ionicons name="refresh" size={20} color="#fff" />
                  <Text style={styles.sidebarButtonText}>Reset Abacus</Text>
                </TouchableOpacity>
              </View>

              {currentValue > 0 && (
                <View style={styles.sidebarValueSection}>
                  <Text style={styles.sidebarValueLabel}>Current Value:</Text>
                  <Text style={styles.sidebarValueText}>{currentValue.toFixed(4)}</Text>
                </View>
              )}
            </View>
          </Animated.View>
        )}

        {/* PURE ABACUS AREA - NO EXTRA UI ELEMENTS */}
        <View style={[
          styles.abacusArea,
          {
            width: mode === 'exercise' ? '60%' : '100%',
            marginLeft: mode === 'free' && sidebarWidth > 0 ? sidebarPixelWidth : 0,
          }
        ]}>
          <View style={styles.fullScreenAbacusFrame}>
            <View style={styles.columnLabelsContainer}>
              {Object.keys(abacusState).map((columnIndex) => {
                const getColumnLabel = (index) => {
                  switch (parseInt(index)) {
                    case 0: return '10K';
                    case 1: return '1K';
                    case 2: return '100';
                    case 3: return '10';
                    case 4: return '1';
                    case 5: return '0.1';
                    case 6: return '0.01';
                    case 7: return '0.001';
                    case 8: return '0.0001';
                    default: return '';
                  }
                };
                
                return (
                  <View key={columnIndex} style={styles.columnLabelContainer}>
                    <Text style={styles.fullScreenColumnLabel}>
                      {getColumnLabel(columnIndex)}
                    </Text>
                  </View>
                );
              })}
            </View>
            
            <View style={styles.fullScreenAbacusBody}>
              {Object.keys(abacusState).map((columnIndex) => 
                renderFullScreenAbacusColumn(parseInt(columnIndex))
              )}
            </View>
            
            {/* Simple bottom indicator showing current value - minimal */}
            <View style={styles.currentValueIndicator}>
              <Text style={styles.currentValueText}>{currentValue}</Text>
            </View>
          </View>
        </View>

        {/* ALL CONTROLS IN EXERCISE PANEL - 40% of screen */}
        {mode === 'exercise' && (
          <View style={styles.exercisePanel}>
            <ScrollView style={styles.exercisePanelContent} showsVerticalScrollIndicator={false}>
              {/* Back to Free Mode and Home buttons at top */}
              <View style={styles.exerciseHeader}>
                <TouchableOpacity style={styles.backToFreeButton} onPress={() => setMode('free')}>
                  <Ionicons name="arrow-back" size={20} color="#fff" />
                  <Text style={styles.backToFreeText}>Free Mode</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.homeButton} onPress={handleBackPress}>
                  <Ionicons name="home" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              {exerciseMode && (
                <View style={styles.currentProblemSection}>
                  <Text style={styles.problemSectionTitle}>Current Problem</Text>
                  <View style={styles.problemCard}>
                    <Text style={styles.problemQuestion}>{exerciseMode.question} = ?</Text>
                    <Text style={styles.problemDifficulty}>Difficulty: {exerciseMode.difficulty}</Text>
                    <View style={styles.currentValueDisplay}>
                      <Text style={styles.currentValueLabel}>Your Answer:</Text>
                      <Text style={styles.currentValueNumber}>{currentValue.toFixed(4)}</Text>
                    </View>
                  </View>
                </View>
              )}

              <View style={styles.exerciseActions}>
                <TouchableOpacity style={styles.checkAnswerButton} onPress={checkAnswer}>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={styles.checkAnswerButtonText}>Check Answer</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.nextProblemButton} onPress={nextProblem}>
                  <Ionicons name="refresh" size={20} color="#fff" />
                  <Text style={styles.nextProblemButtonText}>Next Problem</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.resetButton} onPress={resetAbacus}>
                  <Ionicons name="trash" size={20} color="#fff" />
                  <Text style={styles.resetButtonText}>Reset Abacus</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.scoreSection}>
                <Text style={styles.scoreSectionTitle}>Your Score</Text>
                <View style={styles.scoreCard}>
                  <Text style={styles.scoreNumber}>{score}</Text>
                  <Text style={styles.scoreLabel}>Correct Answers</Text>
                </View>
              </View>

              {problemHistory.length > 0 && (
                <View style={styles.historySection}>
                  <Text style={styles.historySectionTitle}>Recent Problems</Text>
                  {problemHistory.map((result, index) => (
                    <View key={index} style={[
                      styles.historyItem,
                      result.isCorrect ? styles.historyItemCorrect : styles.historyItemIncorrect
                    ]}>
                      <View style={styles.historyProblem}>
                        <Text style={styles.historyQuestionText}>{result.problem}</Text>
                        <Text style={styles.historyTime}>{result.timestamp}</Text>
                      </View>
                      <View style={styles.historyResult}>
                        <Text style={styles.historyAnswerText}>
                          Your: {result.userAnswer.toFixed(2)}
                        </Text>
                        <Text style={styles.historyCorrectText}>
                          Correct: {result.correctAnswer}
                        </Text>
                        <Ionicons 
                          name={result.isCorrect ? "checkmark-circle" : "close-circle"} 
                          size={20} 
                          color={result.isCorrect ? "#4CAF50" : "#F44336"} 
                        />
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Overlay to close sidebar when tapping outside - ONLY in free mode */}
      {sidebarWidth > 0 && mode === 'free' && (
        <TouchableOpacity 
          style={styles.sidebarOverlay}
          onPress={toggleSidebar}
          activeOpacity={1}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E2E2E',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  hamburgerButton: {
    position: 'absolute',
    top: 35,
    left: 20,
    zIndex: 1000,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: '#1B5E20',
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sidebarContent: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  sidebarBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  sidebarBackText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  sidebarSection: {
    marginBottom: 25,
  },
  sidebarSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C8E6C9',
    marginBottom: 10,
  },
  sidebarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  sidebarButtonActive: {
    backgroundColor: '#fff',
  },
  sidebarButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
  },
  sidebarButtonTextActive: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  sidebarValueSection: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  sidebarValueLabel: {
    color: '#C8E6C9',
    fontSize: 14,
    marginBottom: 5,
  },
  sidebarValueText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 998,
  },
  // PURE ABACUS AREA - NO EXTRA UI
  abacusArea: {
    position: 'relative',
    flex: 1,
  },
  fullScreenAbacusFrame: {
    flex: 1,
    backgroundColor: '#8D6E63',
    margin: 5,
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  columnLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    marginTop: 10,
  },
  columnLabelContainer: {
    flex: 1,
    alignItems: 'center',
  },
  fullScreenColumnLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  fullScreenAbacusBody: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    paddingHorizontal: 5,
  },
  fullScreenAbacusColumn: {
    alignItems: 'center',
    position: 'relative',
    flex: 1,
    paddingHorizontal: 2,
  },
  fullScreenUnitsColumn: {
    borderRightWidth: 3,
    borderRightColor: '#5D4037',
    marginRight: 8,
    paddingRight: 8,
  },
  fullScreenHeavenSection: {
    flex: 0.3,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 5,
  },
  fullScreenSeparatorBar: {
    height: 4,
    backgroundColor: '#5D4037',
    marginVertical: 3,
    borderRadius: 2,
  },
  fullScreenEarthSection: {
    flex: 0.7,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 5,
  },
  fullScreenVerticalRod: {
    position: 'absolute',
    backgroundColor: '#5D4037',
    top: 0,
    bottom: 0,
    zIndex: -1,
    borderRadius: 2,
  },
  // Simple current value indicator at bottom
  currentValueIndicator: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  currentValueText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  // EXERCISE PANEL - ALL CONTROLS HERE
  exercisePanel: {
    width: '40%',
    backgroundColor: '#37474F',
    borderLeftWidth: 2,
    borderLeftColor: '#4CAF50',
  },
  exercisePanelContent: {
    flex: 1,
    padding: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#4CAF50',
  },
  backToFreeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backToFreeText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  homeButton: {
    backgroundColor: '#FF5722',
    padding: 10,
    borderRadius: 8,
  },
  currentProblemSection: {
    marginBottom: 20,
  },
  problemSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  problemCard: {
    backgroundColor: '#455A64',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  problemQuestion: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  problemDifficulty: {
    fontSize: 14,
    color: '#81C784',
    textAlign: 'center',
    marginBottom: 12,
  },
  currentValueDisplay: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  currentValueLabel: {
    fontSize: 14,
    color: '#C8E6C9',
    marginBottom: 4,
  },
  currentValueNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'monospace',
  },
  exerciseActions: {
    marginBottom: 20,
  },
  checkAnswerButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  checkAnswerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  nextProblemButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  nextProblemButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  resetButton: {
    backgroundColor: '#FF5722',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  scoreSection: {
    marginBottom: 20,
  },
  scoreSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  scoreCard: {
    backgroundColor: '#455A64',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  scoreNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
  historySection: {
    marginBottom: 20,
  },
  historySectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  historyItem: {
    backgroundColor: '#455A64',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  historyItemCorrect: {
    borderLeftColor: '#4CAF50',
  },
  historyItemIncorrect: {
    borderLeftColor: '#F44336',
  },
  historyProblem: {
    marginBottom: 8,
  },
  historyQuestionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  historyTime: {
    fontSize: 12,
    color: '#B0BEC5',
  },
  historyResult: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyAnswerText: {
    fontSize: 12,
    color: '#fff',
  },
  historyCorrectText: {
    fontSize: 12,
    color: '#C8E6C9',
  },
});

export default AbacusScreen;