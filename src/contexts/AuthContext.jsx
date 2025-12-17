import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi';

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

  const login = async (loginData, password) => {
    try {
      // Используем метод из API вместо прямого поиска по массиву
      const userData = await mockApi.login(loginData, password);
      
      // Обеспечиваем наличие роли
      const userWithRole = { 
        ...userData, 
        role: userData.role || (userData.name === 'Администратор' ? 'ADMIN' : 'USER') 
      };
      
      setUser(userWithRole);
      localStorage.setItem('currentUser', JSON.stringify(userWithRole));
      return userWithRole;
    } catch (error) {
      // Пробрасываем ошибку дальше, чтобы LoginForm мог её показать
      throw error;
    }
  };

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
