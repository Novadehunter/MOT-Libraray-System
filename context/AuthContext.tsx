import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Role } from '../types';
import { useAppContext } from './AppContext';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string) => User | null;
  logout: () => void;
  register: (name: string, email: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { users, addUser } = useAppContext();
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);
  
  const login = (email: string): User | null => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.isActive);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = async (name: string, email: string): Promise<{ success: boolean; message: string }> => {
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser: Omit<User, 'id'> = {
      name,
      email,
      role: Role.Reader,
      isActive: true,
    };
    
    addUser(newUser);
    
    return { success: true, message: 'Registration successful! You can now log in.' };
  };

  const value = { currentUser, login, logout, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};