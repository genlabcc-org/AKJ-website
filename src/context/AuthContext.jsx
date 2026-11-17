import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext(null);

function getFriendlyFirebaseError(error) {
  switch (error?.code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid admin email or password.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This admin account has been disabled.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    default:
      return error?.message || 'Failed to sign in. Please try again.';
  }
}

export function AuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setAdminUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Administrator',
          role: 'Admin',
        });
      } else {
        setAdminUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password, rememberDevice = true) => {
    try {
      await setPersistence(
        auth,
        rememberDevice ? browserLocalPersistence : browserSessionPersistence
      );
      await signInWithEmailAndPassword(auth, email.trim(), password);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: getFriendlyFirebaseError(error),
      };
    }
  };

  const resetPassword = async (email) => {
    if (!email || !email.trim()) {
      return {
        success: false,
        error: 'Please enter your email address first to reset your password.',
      };
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return {
        success: true,
        message: 'Password reset email sent! Please check your inbox.',
      };
    } catch (error) {
      return {
        success: false,
        error: getFriendlyFirebaseError(error),
      };
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        isAuthenticated: Boolean(adminUser),
        loading,
        login,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
