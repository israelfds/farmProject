export const lightTheme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40',
    
    // Backgrounds
    background: '#ffffff',
    backgroundSecondary: '#f8f9fa',
    backgroundTertiary: '#e9ecef',
    
    // Text
    text: '#2c3e50',
    textSecondary: '#6c757d',
    textMuted: '#868e96',
    
    // Borders
    border: '#dee2e6',
    borderLight: '#e9ecef',
    
    // Cards
    cardBackground: '#ffffff',
    cardBorder: '#e9ecef',
    cardShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    
    // Inputs
    inputBackground: '#ffffff',
    inputBorder: '#ced4da',
    inputFocus: '#007bff',
    inputError: '#dc3545',
    
    // Buttons
    buttonPrimary: '#007bff',
    buttonSecondary: '#6c757d',
    buttonSuccess: '#28a745',
    buttonDanger: '#dc3545',
    buttonText: '#ffffff',
    
    // Charts
    chartBackground: '#ffffff',
    chartText: '#2c3e50',
    
    // Sidebar
    sidebarBackground: '#2c3e50',
    sidebarText: '#ffffff',
    sidebarHover: '#34495e',
    
    // Header
    headerBackground: '#ffffff',
    headerBorder: '#e9ecef',
    headerText: '#2c3e50',
  },
  
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.15)',
    large: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
  
  transitions: {
    fast: '0.2s ease-in-out',
    medium: '0.3s ease-in-out',
    slow: '0.5s ease-in-out',
  },
};

export const darkTheme = {
  colors: {
    primary: '#4dabf7',
    secondary: '#adb5bd',
    success: '#51cf66',
    danger: '#ff6b6b',
    warning: '#ffd43b',
    info: '#74c0fc',
    light: '#495057',
    dark: '#f8f9fa',
    
    // Backgrounds
    background: '#1a1a1a',
    backgroundSecondary: '#2d2d2d',
    backgroundTertiary: '#404040',
    
    // Text
    text: '#ffffff',
    textSecondary: '#adb5bd',
    textMuted: '#6c757d',
    
    // Borders
    border: '#404040',
    borderLight: '#495057',
    
    // Cards
    cardBackground: '#2d2d2d',
    cardBorder: '#404040',
    cardShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    
    // Inputs
    inputBackground: '#404040',
    inputBorder: '#495057',
    inputFocus: '#4dabf7',
    inputError: '#ff6b6b',
    
    // Buttons
    buttonPrimary: '#4dabf7',
    buttonSecondary: '#adb5bd',
    buttonSuccess: '#51cf66',
    buttonDanger: '#ff6b6b',
    buttonText: '#ffffff',
    
    // Charts
    chartBackground: '#2d2d2d',
    chartText: '#ffffff',
    
    // Sidebar
    sidebarBackground: '#1a1a1a',
    sidebarText: '#ffffff',
    sidebarHover: '#404040',
    
    // Header
    headerBackground: '#2d2d2d',
    headerBorder: '#404040',
    headerText: '#ffffff',
  },
  
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.3)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.4)',
    large: '0 8px 16px rgba(0, 0, 0, 0.5)',
  },
  
  transitions: {
    fast: '0.2s ease-in-out',
    medium: '0.3s ease-in-out',
    slow: '0.5s ease-in-out',
  },
};

export type Theme = typeof lightTheme; 