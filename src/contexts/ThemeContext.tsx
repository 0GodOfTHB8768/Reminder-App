import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, COLLECTIONS } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { type NFLTheme, DEFAULT_THEME, getThemeById } from '../lib/themes';

interface ThemeContextType {
  theme: NFLTheme;
  setTheme: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const THEME_STORAGE_KEY = 'game-day-theme';

// Apply theme to CSS variables
function applyThemeToDOM(theme: NFLTheme) {
  const root = document.documentElement;

  // Primary colors
  root.style.setProperty('--theme-primary', theme.primary);
  root.style.setProperty('--theme-secondary', theme.secondary);
  root.style.setProperty('--theme-primary-rgb', theme.primaryRgb);
  root.style.setProperty('--theme-secondary-rgb', theme.secondaryRgb);

  // Update meta theme color
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', theme.primary);
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [theme, setThemeState] = useState<NFLTheme>(() => {
    // Try to load from localStorage on initial render
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored) {
        return getThemeById(stored);
      }
    }
    return DEFAULT_THEME;
  });

  // Apply theme on mount and when it changes
  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  // Save theme to Firestore when user is logged in
  const saveThemeToFirestore = useCallback(async (themeId: string) => {
    if (!user || !db) return;

    try {
      const userRef = doc(db, COLLECTIONS.USERS, user.uid);
      await setDoc(userRef, { themeId }, { merge: true });
    } catch (error) {
      console.error('Failed to save theme to Firestore:', error);
    }
  }, [user]);

  const setTheme = useCallback((themeId: string) => {
    const newTheme = getThemeById(themeId);
    setThemeState(newTheme);

    // Save to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, themeId);

    // Save to Firestore if logged in
    if (user) {
      saveThemeToFirestore(themeId);
    }
  }, [user, saveThemeToFirestore]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
