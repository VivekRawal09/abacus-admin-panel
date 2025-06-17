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
  PanGestureHandler,
  State,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useFocusEffect } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const AbacusScreen = ({ navigation }) => {
  const [isLandscape, setIsLandscape] = useState(false);
  const [currentValue, setCurrentValue] = useState(0);
  const [mode, setMode] = useState('free'); // 'free' or 'exercise'
  const [exerciseMode, setExerciseMode] = useState(null);
  
  // Abacus state - 7 columns (units, tens, hundreds, etc.)
  const [abacusState, setAbacusState] = useState({
    0: { heaven: false, earth: [false, false, false, false] }, // Units
    1: { heaven: false, earth: [false, false, false, false] }, // Tens
    2: { heaven: false, earth: [false, false, false, false] }, // Hundreds
    3: { heaven: false, earth: [false, false, false, false] }, // Thousands
    4: { heaven: false, earth: [false, false, false, false] }, // Ten thousands
    5: { heaven: false, earth: [false, false, false, false] }, // Hundred thousands
    6: { heaven: false, earth: [false, false, false, false] }, // Millions
  });

  const exerciseProblems = [
    { question: "5 + 3", answer: 8 },
    { question: "7 + 2", answer: 9 },
    { question: "4 + 6", answer: 10 },
    { question: "12 + 8", answer: 20 },
    { question: "15 + 7", answer: 22 },
  ];

  // Handle back button press
  const handleBackPress = async () => {
    try {
      // Use PORTRAIT_UP instead of PORTRAIT for iOS compatibility
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      StatusBar.setHidden(false);
      // Small delay to ensure orientation change completes
      setTimeout(() => {
        navigation.goBack();
      }, 100);
    } catch (error) {
      console.log('Orientation reset failed:', error);
      // Fallback: try unlocking orientation instead
      try {
        await ScreenOrientation.unlockAsync();
        StatusBar.setHidden(false);
      } catch (unlockError) {
        console.log('Orientation unlock failed:', unlockError);
      }
      navigation.goBack();
    }
  };

  // Use focus effect to handle orientation properly
  useFocusEffect(
    React.useCallback(() => {
      // Set landscape when screen is focused
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

      // Reset to portrait when screen loses focus
      return () => {
        const resetPortrait = async () => {
          try {
            // Try PORTRAIT_UP first, then fallback to unlock
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
    // Add navigation listener for additional safety
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

    // Cleanup function to reset orientation when component unmounts
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
            setIsLandscape(false);
          } catch (unlockError) {
            console.log('Cleanup orientation unlock failed:', unlockError);
          }
        }
      };
      resetOrientation();
    };
  }, [navigation]);

  const calculateValue = () => {
    let total = 0;
    Object.keys(abacusState).forEach((columnIndex) => {
      const column = abacusState[columnIndex];
      const multiplier = Math.pow(10, parseInt(columnIndex));
      
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

  const toggleHeavenBead = (columnIndex) => {
    setAbacusState(prev => ({
      ...prev,
      [columnIndex]: {
        ...prev[columnIndex],
        heaven: !prev[columnIndex].heaven
      }
    }));
    setTimeout(calculateValue, 50);
  };

  const toggleEarthBead = (columnIndex, beadIndex) => {
    setAbacusState(prev => {
      const newEarthBeads = [...prev[columnIndex].earth];
      
      if (newEarthBeads[beadIndex]) {
        // If this bead is active, deactivate it and all above it
        for (let i = beadIndex; i < newEarthBeads.length; i++) {
          newEarthBeads[i] = false;
        }
      } else {
        // If this bead is inactive, activate it and all below it
        for (let i = 0; i <= beadIndex; i++) {
          newEarthBeads[i] = true;
        }
      }
      
      return {
        ...prev,
        [columnIndex]: {
          ...prev[columnIndex],
          earth: newEarthBeads
        }
      };
    });
    setTimeout(calculateValue, 50);
  };

  const resetAbacus = () => {
    setAbacusState({
      0: { heaven: false, earth: [false, false, false, false] },
      1: { heaven: false, earth: [false, false, false, false] },
      2: { heaven: false, earth: [false, false, false, false] },
      3: { heaven: false, earth: [false, false, false, false] },
      4: { heaven: false, earth: [false, false, false, false] },
      5: { heaven: false, earth: [false, false, false, false] },
      6: { heaven: false, earth: [false, false, false, false] },
    });
    setCurrentValue(0);
  };

  const startExercise = () => {
    setMode('exercise');
    resetAbacus();
    const randomProblem = exerciseProblems[Math.floor(Math.random() * exerciseProblems.length)];
    setExerciseMode(randomProblem);
  };

  const checkAnswer = () => {
    if (currentValue === exerciseMode.answer) {
      Alert.alert(
        'Correct! 🎉',
        `Great job! ${exerciseMode.question} = ${currentValue}`,
        [
          { text: 'Next Problem', onPress: startExercise },
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

  const renderAbacusColumn = (columnIndex) => {
    const column = abacusState[columnIndex];
    const isRightMost = columnIndex === 0;
    
    return (
      <View key={columnIndex} style={[styles.abacusColumn, isRightMost && styles.unitsColumn]}>
        {/* Column Label */}
        <Text style={styles.columnLabel}>
          {columnIndex === 0 ? '1s' : 
           columnIndex === 1 ? '10s' :
           columnIndex === 2 ? '100s' :
           columnIndex === 3 ? '1Ks' :
           columnIndex === 4 ? '10Ks' :
           columnIndex === 5 ? '100Ks' : 'Ms'}
        </Text>
        
        {/* Heaven Section (5-value bead) */}
        <View style={styles.heavenSection}>
          <TouchableOpacity
            style={[
              styles.heavenBead,
              column.heaven && styles.heavenBeadActive
            ]}
            onPress={() => toggleHeavenBead(columnIndex)}
          >
            <View style={styles.beadInner} />
          </TouchableOpacity>
        </View>
        
        {/* Separator Bar */}
        <View style={styles.separatorBar} />
        
        {/* Earth Section (1-value beads) */}
        <View style={styles.earthSection}>
          {column.earth.map((isActive, beadIndex) => (
            <TouchableOpacity
              key={beadIndex}
              style={[
                styles.earthBead,
                isActive && styles.earthBeadActive
              ]}
              onPress={() => toggleEarthBead(columnIndex, beadIndex)}
            >
              <View style={styles.beadInner} />
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Vertical Rod */}
        <View style={styles.verticalRod} />
      </View>
    );
  };

  if (!isLandscape) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <Ionicons name="phone-portrait" size={60} color="#4CAF50" />
          <Text style={styles.loadingText}>Rotating to Landscape...</Text>
          <Text style={styles.loadingSubtext}>Please rotate your device</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Controls */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Virtual Abacus</Text>
        
        <View style={styles.headerControls}>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'free' && styles.modeButtonActive]}
            onPress={() => setMode('free')}
          >
            <Text style={[styles.modeButtonText, mode === 'free' && styles.modeButtonTextActive]}>
              Free
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.modeButton, mode === 'exercise' && styles.modeButtonActive]}
            onPress={startExercise}
          >
            <Text style={[styles.modeButtonText, mode === 'exercise' && styles.modeButtonTextActive]}>
              Exercise
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resetButton} onPress={resetAbacus}>
            <Ionicons name="refresh" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Abacus Area */}
      <View style={styles.abacusContainer}>
        {/* Current Value Display */}
        <View style={styles.valueDisplay}>
          <Text style={styles.valueText}>{currentValue.toLocaleString()}</Text>
          {mode === 'exercise' && exerciseMode && (
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseQuestion}>{exerciseMode.question} = ?</Text>
              <TouchableOpacity style={styles.checkButton} onPress={checkAnswer}>
                <Text style={styles.checkButtonText}>Check Answer</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Abacus Frame */}
        <View style={styles.abacusFrame}>
          {/* Top Frame */}
          <View style={styles.topFrame} />
          
          {/* Abacus Columns */}
          <View style={styles.abacusBody}>
            {Object.keys(abacusState).reverse().map((columnIndex) => 
              renderAbacusColumn(parseInt(columnIndex))
            )}
          </View>
          
          {/* Bottom Frame */}
          <View style={styles.bottomFrame} />
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionsText}>
            {mode === 'free' 
              ? 'Tap beads to count • Top bead = 5 • Bottom beads = 1 each'
              : 'Solve the problem using the abacus, then check your answer'
            }
          </Text>
        </View>
      </View>
    </SafeAreaView>
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
  header: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 44,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fff',
    marginRight: 8,
  },
  modeButtonActive: {
    backgroundColor: '#fff',
  },
  modeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  modeButtonTextActive: {
    color: '#4CAF50',
  },
  resetButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  abacusContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  valueDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  valueText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    fontFamily: 'monospace',
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  exerciseQuestion: {
    fontSize: 20,
    color: '#fff',
    marginRight: 16,
  },
  checkButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  checkButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  abacusFrame: {
    backgroundColor: '#8D6E63',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  topFrame: {
    height: 8,
    backgroundColor: '#5D4037',
    borderRadius: 4,
    marginBottom: 8,
  },
  abacusBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 200,
  },
  bottomFrame: {
    height: 8,
    backgroundColor: '#5D4037',
    borderRadius: 4,
    marginTop: 8,
  },
  abacusColumn: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  unitsColumn: {
    borderRightWidth: 2,
    borderRightColor: '#5D4037',
    marginRight: 8,
    paddingRight: 8,
  },
  columnLabel: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heavenSection: {
    height: 60,
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  heavenBead: {
    width: 30,
    height: 20,
    backgroundColor: '#FFD54F',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F57F17',
  },
  heavenBeadActive: {
    backgroundColor: '#FF6F00',
    borderColor: '#E65100',
  },
  separatorBar: {
    width: 40,
    height: 3,
    backgroundColor: '#5D4037',
    marginVertical: 4,
  },
  earthSection: {
    height: 90,
    justifyContent: 'flex-start',
    marginTop: 4,
  },
  earthBead: {
    width: 24,
    height: 16,
    backgroundColor: '#FFD54F',
    borderRadius: 8,
    marginVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F57F17',
  },
  earthBeadActive: {
    backgroundColor: '#FF6F00',
    borderColor: '#E65100',
  },
  beadInner: {
    width: 8,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 4,
  },
  verticalRod: {
    position: 'absolute',
    width: 4,
    height: '100%',
    backgroundColor: '#5D4037',
    top: 20,
    zIndex: -1,
  },
  instructions: {
    marginTop: 20,
    alignItems: 'center',
  },
  instructionsText: {
    fontSize: 14,
    color: '#BDBDBD',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default AbacusScreen;