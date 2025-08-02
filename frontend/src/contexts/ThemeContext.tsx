import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setTheme } from '../store/slices/uiSlice';
import { lightTheme, darkTheme, Theme } from '../styles/theme';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const themeMode = useSelector((state: RootState) => state.ui.theme);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;
  const isDark = themeMode === 'dark';

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    dispatch(setTheme(newTheme));
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    // Carregar tema do localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      dispatch(setTheme(savedTheme));
    } else {
      // Detectar preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      dispatch(setTheme(prefersDark ? 'dark' : 'light'));
    }
    setIsInitialized(true);
  }, [dispatch]);

  useEffect(() => {
    if (isInitialized) {
      // Aplicar tema ao body
      document.body.style.backgroundColor = theme.colors.background;
      document.body.style.color = theme.colors.text;
    }
  }, [theme, isInitialized]);

  const value: ThemeContextType = {
    theme,
    isDark,
    toggleTheme,
  };

  // Don't render children until theme is initialized
  if (!isInitialized) {
    return (
      <ThemeContext.Provider value={value}>
        <div style={{ 
          backgroundColor: theme.colors.background, 
          color: theme.colors.text,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          Loading...
        </div>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 