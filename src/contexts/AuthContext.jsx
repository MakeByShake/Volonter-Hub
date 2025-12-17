import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../services/mockApi';

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

  const login = (loginData, password) => {
    return new Promise((resolve, reject) => {
      // Ищем пользователя по email или имени
      const foundUser = mockUsers.find(u => 
        (u.email === loginData || u.name === loginData) && u.password === password
      );

      if (foundUser) {
        // При входе добавляем роль, если её нет
        const userWithRole = { 
          ...foundUser, 
          role: foundUser.role || (foundUser.name === 'Admin' ? 'admin' : 'volunteer') 
        };
        
        setUser(userWithRole);
        localStorage.setItem('currentUser', JSON.stringify(userWithRole));
        resolve(userWithRole);
      } else {
        reject(new Error('Неверный логин или пароль'));
      }
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  // ВОТ ЭТА ФУНКЦИЯ БЫЛА НУЖНА, ЧТОБЫ НЕ БЫЛО БЕЛОГО ЭКРАНА
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    login,
    logout,
    isAdmin, // Обязательно передаем её здесь
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
