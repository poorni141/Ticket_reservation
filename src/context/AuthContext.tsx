import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { api } from '../services/api';
import { INITIAL_USERS } from '../mockData';

interface AuthContextType {
  user: User;
  role: UserRole;
  login: (email: string) => Promise<void>;
  register: (data: { name: string; email: string; collegeId?: string; role?: UserRole }) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => api.getCurrentUser());

  useEffect(() => {
    api.setCurrentUser(user);
  }, [user]);

  const login = async (email: string) => {
    const loggedIn = await api.login(email);
    setUser(loggedIn);
  };

  const register = async (data: { name: string; email: string; collegeId?: string; role?: UserRole }) => {
    const registered = await api.register(data);
    setUser(registered);
  };

  const logout = () => {
    // Switch back to default student demo user
    setUser(INITIAL_USERS[0]);
  };

  const switchRole = (newRole: UserRole) => {
    const matched = INITIAL_USERS.find(u => u.role === newRole);
    if (matched) {
      setUser(matched);
    } else {
      setUser(prev => ({ ...prev, role: newRole }));
    }
  };

  return (
    <AuthContext.Provider value={{ user, role: user.role, login, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
