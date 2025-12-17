import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi'; // 1. Исправлен импорт

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Ошибка чтения пользователя", e);
      }
    }
    setLoading(false);
  }, []);

  // 2. Используем mockApi для входа
  const login = async (loginData, password) => {
    try {
      const user = await mockApi.login(loginData, password);
      // mockApi возвращает пользователя без пароля
      setUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    } catch (error) {
      throw error;
    }
  };

  // 3. Добавляем функцию регистрации (её не было, но она используется в Register.jsx)
  const register = async (userData) => {
    try {
      const newUser = await mockApi.register(userData);
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  // 4. Исправляем проверку роли (в mockApi роль 'ADMIN', а не 'admin')
  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
