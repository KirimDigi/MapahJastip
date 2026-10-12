import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role?: 'customer' | 'admin';
  avatarUrl?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (name: string, email: string, phone: string, role?: 'customer' | 'admin') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'mapah_user_profile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore localStorage errors
    }
  }, [user]);

  const login = (name: string, email: string, phone: string, role?: 'customer' | 'admin') => {
    const assignedRole = role || (email.toLowerCase().includes('admin') ? 'admin' : 'customer');
    setUser({
      name: name || (assignedRole === 'admin' ? 'Admin MapahJastip' : 'Budi Pratama'),
      email: email || (assignedRole === 'admin' ? 'admin@mapahjastip.id' : 'customer@mapahjastip.id'),
      phone: phone || (assignedRole === 'admin' ? '081280905425' : '081234567890'),
      role: assignedRole,
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAdmin: user?.role === 'admin',
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
