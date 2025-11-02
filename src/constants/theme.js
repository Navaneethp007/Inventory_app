export const COLORS = {
  primary: '#6C63FF',
  primaryDark: '#5B54E6',
  primaryLight: '#8B84FF',
  secondary: '#4CAF50',
  secondaryDark: '#45A049',
  accent: '#FF6B6B',
  background: '#F5F7FA',
  backgroundDark: '#E8EDF2',
  card: '#FFFFFF',
  text: '#2D3436',
  textLight: '#636E72',
  textExtraLight: '#95A5A6',
  border: '#DFE6E9',
  borderLight: '#ECF0F1',
  success: '#00B894',
  successLight: '#55EFC4',
  warning: '#FDCB6E',
  warningDark: '#F39C12',
  danger: '#D63031',
  dangerLight: '#FF7675',
  info: '#74B9FF',
  infoDark: '#0984E3',
  
  // Gradient combinations
  gradients: {
    primary: ['#6C63FF', '#5B54E6', '#4A45CC'],
    secondary: ['#4CAF50', '#45A049', '#3D8B40'],
    success: ['#00B894', '#00D2A3', '#00E5B3'],
    warning: ['#FDCB6E', '#F39C12', '#E67E22'],
    danger: ['#D63031', '#E74C3C', '#C0392B'],
    info: ['#74B9FF', '#0984E3', '#0652DD'],
    purple: ['#A29BFE', '#6C5CE7', '#5F3DC4'],
    pink: ['#FD79A8', '#E84393', '#C44569'],
    ocean: ['#00B4DB', '#0083B0', '#006A8E'],
  }
};

export const SIZES = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  colored: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
};

export const FONTS = {
  regular: 'System',
  bold: 'System',
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 22,
    xxl: 28,
    xxxl: 34,
  },
};

export const ANIMATION = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  spring: {
    damping: 15,
    stiffness: 150,
  },
};