import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import screens (we'll create these next)
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import CoursesScreen from './src/screens/CourseScreen';
import CourseDetailScreen from './src/screens/CourseDetailScreen';
import VideoPlayerScreen from './src/screens/VideoPlayerScreen';
import AbacusScreen from './src/screens/AbacusScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import SubscriptionScreen from './src/screens/SubscriptionScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import HelpScreen from './src/screens/HelpScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Stack Navigator for screens that need to be stacked (like Course -> CourseDetail -> VideoPlayer)
function MainStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
      <Stack.Screen name="Abacus" component={AbacusScreen} />
    </Stack.Navigator>
  );
}

// Drawer Navigator for main navigation
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerStyle: {
          backgroundColor: '#f8f9fa',
          width: 280,
        },
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
        },
        drawerActiveTintColor: '#4CAF50',
        drawerInactiveTintColor: '#666',
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Courses" 
        component={CoursesScreen}
        options={{
          title: 'My Courses',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="PracticeAbacus" 
        component={AbacusScreen}
        options={{
          title: 'Practice Abacus',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="calculator" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Progress" 
        component={ProgressScreen}
        options={{
          title: 'My Progress',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="bar-chart" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Subscription" 
        component={SubscriptionScreen}
        options={{
          title: 'Subscription',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="card" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Help" 
        component={HelpScreen}
        options={{
          title: 'Help/Chat Support',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="help-circle" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

// Authentication Stack Navigator
function AuthStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  // For demo purposes, we'll use a simple state to track if user is logged in
  // In a real app, this would come from authentication state management
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  // Auto-login for demo purposes
  React.useEffect(() => {
    // Show login screen for 3 seconds, then auto-login
    const timer = setTimeout(() => {
      setIsLoggedIn(true);
    }, 3000); // 3 second delay to show login screen

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
      <NavigationContainer>
        {isLoggedIn ? <MainStackNavigator /> : <AuthStackNavigator />}
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});