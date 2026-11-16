import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'akj_admin_auth';

const DEFAULT_ADMIN = {
  email: 'admin@acadly.com',
  username: 'admin',
  password: 'admin123',
  name: 'Administrator',
  role: 'Super Admin',
};

export function AuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (adminUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(adminUser));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }, [adminUser]);

  const login = (identifier, password) => {
    const cleanId = identifier.trim().toLowerCase();
    const isValidUser =
      cleanId === DEFAULT_ADMIN.email.toLowerCase() ||
      cleanId === DEFAULT_ADMIN.username.toLowerCase();

    if (isValidUser && password === DEFAULT_ADMIN.password) {
      const sessionUser = {
        email: DEFAULT_ADMIN.email,
        username: DEFAULT_ADMIN.username,
        name: DEFAULT_ADMIN.name,
        role: DEFAULT_ADMIN.role,
        loggedInAt: new Date().toISOString(),
      };
      setAdminUser(sessionUser);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid admin email/username or password.',
    };
  };

  const logout = () => {
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        isAuthenticated: Boolean(adminUser),
        login,
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

