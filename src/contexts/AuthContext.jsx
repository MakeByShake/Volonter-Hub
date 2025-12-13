import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('volunteer_platform_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (login, password) => {
    try {
      const userData = await mockApi.login(login, password);
      setUser(userData);
      localStorage.setItem('volunteer_platform_user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const newUser = await mockApi.register(userData);
      setUser(newUser);
      localStorage.setItem('volunteer_platform_user', JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('volunteer_platform_user');
  };

  const refreshUser = async () => {
    if (user) {
      const updatedUser = await mockApi.getUserById(user.id);
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem('volunteer_platform_user', JSON.stringify(updatedUser));
      }
    }
  };

  const isAdmin = () => user?.role === 'ADMIN';
  const isUser = () => user?.role === 'USER';

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
    isAdmin,
    isUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
