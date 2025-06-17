import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Switch,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
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
  });

  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showAbacusSizeModal, setShowAbacusSizeModal] = useState(false);
  const [showBeadColorModal, setShowBeadColorModal] = useState(false);

  const themeOptions = [
    { value: 'light', label: 'Light', icon: 'sunny' },
    { value: 'dark', label: 'Dark', icon: 'moon' },
    { value: 'auto', label: 'Auto (System)', icon: 'phone-portrait' },
  ];

  const languageOptions = [
    { value: 'english', label: 'English', flag: '🇺🇸' },
    { value: 'hindi', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
  ];

  const abacusSizeOptions = [
    { value: 'small', label: 'Small', description: 'Compact size for smaller screens' },
    { value: 'medium', label: 'Medium', description: 'Standard size (recommended)' },
    { value: 'large', label: 'Large', description: 'Larger beads for better visibility' },
  ];

  const beadColorOptions = [
    { value: 'golden', label: 'Golden', color: '#FFD700' },
    { value: 'wooden', label: 'Wooden Brown', color: '#8D6E63' },
    { value: 'colorful', label: 'Colorful', color: '#FF5722' },
    { value: 'blue', label: 'Blue', color: '#2196F3' },
  ];

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleEditProfile = () => {
    Alert.alert('Demo Mode', 'Profile editing is not available in demo mode.');
  };

  const handleChangePassword = () => {
    Alert.alert('Demo Mode', 'Password change is not available in demo mode.');
  };

  const handlePrivacySettings = () => {
    Alert.alert('Demo Mode', 'Privacy settings are not available in demo mode.');
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data including downloaded videos. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: () => {
            Alert.alert('Demo Mode', 'Cache clearing is not available in demo mode.');
          },
        },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'This will reset all settings to default values. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setSettings({
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
            });
            Alert.alert('Settings Reset', 'All settings have been reset to default values.');
          },
        },
      ]
    );
  };

  const renderSectionHeader = (title, icon) => (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={20} color="#4CAF50" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const renderSettingRow = (title, subtitle, rightComponent, onPress) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  const renderSwitchRow = (title, subtitle, value, onValueChange) => (
    renderSettingRow(
      title,
      subtitle,
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E0E0E0', true: '#C8E6C9' }}
        thumbColor={value ? '#4CAF50' : '#f4f3f4'}
      />,
      null
    )
  );

  const renderModal = (visible, setVisible, title, options, currentValue, onSelect, keyProp = 'value') => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setVisible(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {options.map((option) => (
              <TouchableOpacity
                key={option[keyProp]}
                style={[
                  styles.modalOption,
                  currentValue === option[keyProp] && styles.modalOptionSelected
                ]}
                onPress={() => {
                  onSelect(option[keyProp]);
                  setVisible(false);
                }}
              >
                <View style={styles.modalOptionContent}>
                  {option.icon && (
                    <Ionicons name={option.icon} size={20} color="#666" style={styles.modalOptionIcon} />
                  )}
                  {option.flag && (
                    <Text style={styles.modalOptionFlag}>{option.flag}</Text>
                  )}
                  {option.color && (
                    <View style={[styles.colorSwatch, { backgroundColor: option.color }]} />
                  )}
                  <View style={styles.modalOptionText}>
                    <Text style={styles.modalOptionLabel}>{option.label}</Text>
                    {option.description && (
                      <Text style={styles.modalOptionDescription}>{option.description}</Text>
                    )}
                  </View>
                </View>
                {currentValue === option[keyProp] && (
                  <Ionicons name="checkmark" size={20} color="#4CAF50" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Customize your learning experience</Text>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          {renderSectionHeader('App Settings', 'settings')}
          
          {renderSettingRow(
            'Theme',
            `Current: ${themeOptions.find(t => t.value === settings.theme)?.label}`,
            <Ionicons name="chevron-forward" size={20} color="#ccc" />,
            () => setShowThemeModal(true)
          )}
          
          {renderSettingRow(
            'Language',
            `Current: ${languageOptions.find(l => l.value === settings.language)?.label}`,
            <Ionicons name="chevron-forward" size={20} color="#ccc" />,
            () => setShowLanguageModal(true)
          )}
          
          {renderSwitchRow(
            'Notifications',
            'Receive push notifications for reminders',
            settings.notifications,
            (value) => updateSetting('notifications', value)
          )}
          
          {renderSwitchRow(
            'Sound Effects',
            'Play sounds for interactions',
            settings.soundEffects,
            (value) => updateSetting('soundEffects', value)
          )}
          
          {renderSwitchRow(
            'Vibration',
            'Haptic feedback for touch interactions',
            settings.vibration,
            (value) => updateSetting('vibration', value)
          )}
          
          {renderSwitchRow(
            'Auto Save Progress',
            'Automatically save your progress',
            settings.autoSave,
            (value) => updateSetting('autoSave', value)
          )}
          
          {renderSwitchRow(
            'Download Over WiFi Only',
            'Download content only when connected to WiFi',
            settings.downloadOverWifi,
            (value) => updateSetting('downloadOverWifi', value)
          )}
        </View>

        {/* Abacus Settings */}
        <View style={styles.section}>
          {renderSectionHeader('Abacus Settings', 'calculator')}
          
          {renderSettingRow(
            'Abacus Size',
            `Current: ${abacusSizeOptions.find(s => s.value === settings.abacusSize)?.label}`,
            <Ionicons name="chevron-forward" size={20} color="#ccc" />,
            () => setShowAbacusSizeModal(true)
          )}
          
          {renderSettingRow(
            'Bead Color',
            `Current: ${beadColorOptions.find(c => c.value === settings.beadColor)?.label}`,
            <Ionicons name="chevron-forward" size={20} color="#ccc" />,
            () => setShowBeadColorModal(true)
          )}
          
          {renderSwitchRow(
            'Background Music',
            'Play ambient music during practice',
            settings.backgroundMusic,
            (value) => updateSetting('backgroundMusic', value)
          )}
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          {renderSectionHeader('Notification Preferences', 'notifications')}
          
          {renderSwitchRow(
            'Push Notifications',
            'Receive notifications on your device',
            settings.pushNotifications,
            (value) => updateSetting('pushNotifications', value)
          )}
          
          {renderSwitchRow(
            'Email Notifications',
            'Receive updates via email',
            settings.emailNotifications,
            (value) => updateSetting('emailNotifications', value)
          )}
          
          {renderSwitchRow(
            'Weekly Progress Reports',
            'Get weekly progress summaries',
            settings.weeklyProgress,
            (value) => updateSetting('weeklyProgress', value)
          )}
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          {renderSectionHeader('Account Settings', 'person')}
          
          {renderSettingRow(
            'Edit Profile',
            'Update your personal information',
            <Ionicons name="chevron-forward" size={20} color="#ccc" />,
            handleEditProfile
          )}
          
          {renderSettingRow(
            'Change Password',
            'Update your account password',
            <Ionicons name="chevron-forward" size={20} color="#ccc" />,
            handleChangePassword
          )}
          
          {renderSettingRow(
            'Privacy Settings',
            'Manage your privacy preferences',
            <Ionicons name="chevron-forward" size={20} color="#ccc" />,
            handlePrivacySettings
          )}
        </View>

        {/* Advanced Settings */}
        <View style={styles.section}>
          {renderSectionHeader('Advanced', 'build')}
          
          {renderSettingRow(
            'Clear Cache',
            'Free up storage space',
            <Ionicons name="chevron-forward" size={20} color="#ccc" />,
            handleClearCache
          )}
          
          {renderSettingRow(
            'Reset Settings',
            'Restore all settings to default',
            <Ionicons name="chevron-forward" size={20} color="#F44336" />,
            handleResetSettings
          )}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoTitle}>Abacus Learning App</Text>
          <Text style={styles.appInfoVersion}>Version 1.0.0 (Demo)</Text>
          <Text style={styles.appInfoCopyright}>© 2025 Abacus Learning Inc.</Text>
        </View>
      </ScrollView>

      {/* Modals */}
      {renderModal(
        showThemeModal,
        setShowThemeModal,
        'Select Theme',
        themeOptions,
        settings.theme,
        (value) => updateSetting('theme', value)
      )}

      {renderModal(
        showLanguageModal,
        setShowLanguageModal,
        'Select Language',
        languageOptions,
        settings.language,
        (value) => updateSetting('language', value)
      )}

      {renderModal(
        showAbacusSizeModal,
        setShowAbacusSizeModal,
        'Abacus Size',
        abacusSizeOptions,
        settings.abacusSize,
        (value) => updateSetting('abacusSize', value)
      )}

      {renderModal(
        showBeadColorModal,
        setShowBeadColorModal,
        'Bead Color',
        beadColorOptions,
        settings.beadColor,
        (value) => updateSetting('beadColor', value)
      )}
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
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    marginHorizontal: 20,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  appInfo: {
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  appInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  appInfoVersion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  appInfoCopyright: {
    fontSize: 12,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalContent: {
    maxHeight: 400,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  modalOptionSelected: {
    backgroundColor: '#F8FFF8',
  },
  modalOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalOptionIcon: {
    marginRight: 12,
  },
  modalOptionFlag: {
    fontSize: 20,
    marginRight: 12,
  },
  colorSwatch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalOptionText: {
    flex: 1,
  },
  modalOptionLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  modalOptionDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default SettingsScreen;