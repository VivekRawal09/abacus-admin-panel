import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Design system constants
export const COLORS = {
  // Primary colors
  primary: '#4CAF50',
  primaryLight: '#81C784',
  primaryDark: '#2E7D32',
  
  // Secondary colors
  secondary: '#2196F3',
  secondaryLight: '#64B5F6',
  secondaryDark: '#1976D2',
  
  // Accent colors
  accent: '#FF9800',
  accentLight: '#FFB74D',
  accentDark: '#F57C00',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
  
  // Background colors
  background: '#F8F9FA',
  surface: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Text colors
  textPrimary: '#212121',
  textSecondary: '#757575',
  textHint: '#BDBDBD',
  textInverse: '#FFFFFF',
  
  // Border colors
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  borderDark: '#BDBDBD',
  
  // Educational theme colors
  level1: '#4CAF50',
  level2: '#2196F3',
  level3: '#FF9800',
  level4: '#9C27B0',
  level5: '#F44336',
  
  // Abacus colors
  abacusFrame: '#8D6E63',
  abacusFrameDark: '#5D4037',
  beadDefault: '#FFD54F',
  beadActive: '#FF6F00',
  beadBorder: '#F57F17',
  beadActiveBorder: '#E65100',
};

export const TYPOGRAPHY = {
  // Font families
  fontRegular: 'System',
  fontMedium: 'System',
  fontBold: 'System',
  fontMono: 'monospace',
  
  // Font sizes
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  h6: 16,
  body1: 16,
  body2: 14,
  caption: 12,
  overline: 10,
  
  // Line heights
  lineHeightTight: 1.2,
  lineHeightNormal: 1.4,
  lineHeightRelaxed: 1.6,
  
  // Font weights
  weightLight: '300',
  weightRegular: '400',
  weightMedium: '500',
  weightSemiBold: '600',
  weightBold: '700',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  
  // Screen margins
  screenHorizontal: 20,
  screenVertical: 16,
  
  // Component spacing
  cardPadding: 16,
  buttonPadding: 12,
  inputPadding: 12,
  sectionSpacing: 24,
};

export const LAYOUT = {
  // Screen dimensions
  screenWidth: width,
  screenHeight: height,
  
  // Breakpoints
  phoneSmall: 320,
  phone: 375,
  phoneLarge: 414,
  tablet: 768,
  
  // Layout constants
  headerHeight: 56,
  tabBarHeight: 60,
  statusBarHeight: 44,
  
  // Border radius
  radiusXs: 4,
  radiusSm: 6,
  radiusMd: 8,
  radiusLg: 12,
  radiusXl: 16,
  radiusRound: 50,
  
  // Component heights
  buttonHeight: 48,
  inputHeight: 48,
  cardMinHeight: 120,
  
  // Shadow
  shadowSmall: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  shadowMedium: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shadowLarge: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
};

// Common component styles
export const commonStyles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.screenHorizontal,
  },
  
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  // Headers
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingTop: LAYOUT.statusBarHeight,
  },
  
  headerTitle: {
    fontSize: TYPOGRAPHY.h2,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.textInverse,
  },
  
  headerSubtitle: {
    fontSize: TYPOGRAPHY.body1,
    color: COLORS.textInverse,
    opacity: 0.9,
  },
  
  // Typography
  h1: {
    fontSize: TYPOGRAPHY.h1,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.h1 * TYPOGRAPHY.lineHeightTight,
  },
  
  h2: {
    fontSize: TYPOGRAPHY.h2,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.h2 * TYPOGRAPHY.lineHeightTight,
  },
  
  h3: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.h3 * TYPOGRAPHY.lineHeightTight,
  },
  
  h4: {
    fontSize: TYPOGRAPHY.h4,
    fontWeight: TYPOGRAPHY.weightSemiBold,
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.h4 * TYPOGRAPHY.lineHeightNormal,
  },
  
  body1: {
    fontSize: TYPOGRAPHY.body1,
    fontWeight: TYPOGRAPHY.weightRegular,
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.body1 * TYPOGRAPHY.lineHeightNormal,
  },
  
  body2: {
    fontSize: TYPOGRAPHY.body2,
    fontWeight: TYPOGRAPHY.weightRegular,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.body2 * TYPOGRAPHY.lineHeightNormal,
  },
  
  caption: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: TYPOGRAPHY.weightRegular,
    color: COLORS.textHint,
    lineHeight: TYPOGRAPHY.caption * TYPOGRAPHY.lineHeightNormal,
  },
  
  // Buttons
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: LAYOUT.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: LAYOUT.buttonHeight,
    ...LAYOUT.shadowMedium,
  },
  
  buttonSecondary: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: LAYOUT.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: LAYOUT.buttonHeight,
  },
  
  buttonText: {
    fontSize: TYPOGRAPHY.body1,
    fontWeight: TYPOGRAPHY.weightSemiBold,
    color: COLORS.textInverse,
  },
  
  buttonTextSecondary: {
    fontSize: TYPOGRAPHY.body1,
    fontWeight: TYPOGRAPHY.weightSemiBold,
    color: COLORS.primary,
  },
  
  // Cards
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: LAYOUT.radiusLg,
    padding: SPACING.cardPadding,
    ...LAYOUT.shadowMedium,
  },
  
  cardTitle: {
    fontSize: TYPOGRAPHY.h4,
    fontWeight: TYPOGRAPHY.weightSemiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  
  cardContent: {
    fontSize: TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.body2 * TYPOGRAPHY.lineHeightRelaxed,
  },
  
  // Forms
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  
  inputLabel: {
    fontSize: TYPOGRAPHY.body2,
    fontWeight: TYPOGRAPHY.weightMedium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: LAYOUT.radiusMd,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.inputPadding,
    fontSize: TYPOGRAPHY.body1,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.surface,
    minHeight: LAYOUT.inputHeight,
  },
  
  textInputFocused: {
    borderColor: COLORS.primary,
    ...LAYOUT.shadowSmall,
  },
  
  // Lists
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  
  listItemTitle: {
    fontSize: TYPOGRAPHY.body1,
    fontWeight: TYPOGRAPHY.weightMedium,
    color: COLORS.textPrimary,
    flex: 1,
  },
  
  listItemSubtitle: {
    fontSize: TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
  },
  
  // Progress
  progressContainer: {
    marginVertical: SPACING.md,
  },
  
  progressBar: {
    height: 6,
    backgroundColor: COLORS.gray200,
    borderRadius: LAYOUT.radiusXs,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: LAYOUT.radiusXs,
  },
  
  progressText: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
  
  // Badges
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: LAYOUT.radiusRound,
    alignSelf: 'flex-start',
  },
  
  badgeText: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: TYPOGRAPHY.weightSemiBold,
    color: COLORS.textInverse,
  },
  
  // Dividers
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  
  dividerWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  
  dividerText: {
    paddingHorizontal: SPACING.md,
    fontSize: TYPOGRAPHY.body2,
    color: COLORS.textHint,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  
  loadingText: {
    fontSize: TYPOGRAPHY.body1,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  
  // Error states
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  
  errorText: {
    fontSize: TYPOGRAPHY.body1,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  
  // Empty states
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  
  emptyText: {
    fontSize: TYPOGRAPHY.body1,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});

// Utility functions
export const getScreenDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return { width, height };
};

export const isSmallScreen = () => {
  return width < LAYOUT.phone;
};

export const isTablet = () => {
  return width >= LAYOUT.tablet;
};

export const getResponsivePadding = () => {
  if (isTablet()) return SPACING.xxxl;
  if (isSmallScreen()) return SPACING.md;
  return SPACING.screenHorizontal;
};

export const getResponsiveFontSize = (baseSize) => {
  if (isSmallScreen()) return baseSize - 2;
  if (isTablet()) return baseSize + 2;
  return baseSize;
};

export const createShadow = (elevation) => {
  if (elevation <= 2) return LAYOUT.shadowSmall;
  if (elevation <= 4) return LAYOUT.shadowMedium;
  return LAYOUT.shadowLarge;
};

export const hexToRgba = (hex, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  LAYOUT,
  commonStyles,
  getScreenDimensions,
  isSmallScreen,
  isTablet,
  getResponsivePadding,
  getResponsiveFontSize,
  createShadow,
  hexToRgba,
};