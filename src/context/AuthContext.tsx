import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase';
import { AuthContextType, AuthMode } from '../types/auth';
import { useToast } from './ToastContext';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to convert Firebase error codes into friendly user messages
export function formatAuthErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred.';
  const code = error.code || '';

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please verify your credentials and try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before completing. Please try again.';
    case 'auth/cancelled-popup-request':
      return 'The sign-in popup request was cancelled.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Access temporarily disabled due to many failed attempts. Please try again later.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for Firebase Authentication. Please add it to Firebase Console.';
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>('login');

  const { showToast } = useToast();

  useEffect(() => {
    // Subscribe to Firebase Auth state listener
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        console.error('Firebase Auth State Change Error:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const openAuthModal = (mode: AuthMode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const signupWithEmail = async (email: string, password: string, displayName?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (displayName && displayName.trim()) {
        await updateProfile(userCredential.user, {
          displayName: displayName.trim(),
        });
      }
      closeAuthModal();
      showToast(
        `Welcome to BuyWise AI, ${displayName?.trim() || userCredential.user.email}!`,
        'success',
        'Account Created'
      );
    } catch (err: any) {
      const friendlyMsg = formatAuthErrorMessage(err);
      throw new Error(friendlyMsg);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      closeAuthModal();
      showToast(
        `Welcome back, ${userCredential.user.displayName || userCredential.user.email}!`,
        'success',
        'Signed In'
      );
    } catch (err: any) {
      const friendlyMsg = formatAuthErrorMessage(err);
      throw new Error(friendlyMsg);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Optional: set custom parameters
      provider.setCustomParameters({ prompt: 'select_account' });
      const userCredential = await signInWithPopup(auth, provider);
      closeAuthModal();
      showToast(
        `Welcome back, ${userCredential.user.displayName || 'shopper'}!`,
        'success',
        'Google Sign-In'
      );
    } catch (err: any) {
      const friendlyMsg = formatAuthErrorMessage(err);
      throw new Error(friendlyMsg);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      showToast('You have been signed out.', 'info', 'Signed Out');
    } catch (err: any) {
      console.error('Error signing out:', err);
      showToast('Failed to sign out. Please try again.', 'error');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signupWithEmail,
        loginWithEmail,
        loginWithGoogle,
        logout,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
