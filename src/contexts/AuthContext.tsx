import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured, COLLECTIONS } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  playerName: string;
  needsOnboarding: boolean;
  loading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updatePlayerName: (name: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [playerName, setPlayerName] = useState<string>('Player');
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && db) {
        // Create/update user document in Firestore
        const userRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // New user - create document and mark for onboarding
          await setDoc(userRef, {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            playerName: '', // Empty until they set it
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
          });
          setNeedsOnboarding(true);
          setPlayerName('Player');
        } else {
          // Existing user - check if they have a player name
          const userData = userSnap.data();
          if (userData.playerName) {
            setPlayerName(userData.playerName);
            setNeedsOnboarding(false);
          } else {
            setNeedsOnboarding(true);
            setPlayerName('Player');
          }
          // Update last login
          await setDoc(userRef, {
            lastLoginAt: serverTimestamp(),
          }, { merge: true });
        }
      } else {
        // Not logged in
        setPlayerName('Player');
        setNeedsOnboarding(false);
      }

      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updatePlayerName = async (name: string) => {
    if (!user || !db) return;

    try {
      const userRef = doc(db, COLLECTIONS.USERS, user.uid);
      await setDoc(userRef, { playerName: name }, { merge: true });
      setPlayerName(name);
      setNeedsOnboarding(false);
    } catch (err) {
      console.error('Error updating player name:', err);
      setError('Failed to save your name. Please try again.');
    }
  };

  const signInWithGoogle = async () => {
    if (!auth) {
      setError('Firebase is not configured. Please add your Firebase credentials.');
      return;
    }

    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) {
      setError('Firebase is not configured. Please add your Firebase credentials.');
      return;
    }

    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: unknown) {
      console.error('Email sign-in error:', err);
      const errorCode = (err as { code?: string })?.code;
      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else if (errorCode === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else {
        setError('Failed to sign in. Please try again.');
      }
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!auth) {
      setError('Firebase is not configured. Please add your Firebase credentials.');
      return;
    }

    try {
      setError(null);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: unknown) {
      console.error('Sign-up error:', err);
      const errorCode = (err as { code?: string })?.code;
      if (errorCode === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (errorCode === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (errorCode === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    }
  };

  const logout = async () => {
    if (!auth) return;

    try {
      setError(null);
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to log out. Please try again.');
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        playerName,
        needsOnboarding,
        loading,
        isConfigured: isFirebaseConfigured,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        updatePlayerName,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
