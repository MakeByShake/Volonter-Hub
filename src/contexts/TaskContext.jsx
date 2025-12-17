import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mockApi } from '../services/mockApi';
import { useAuth } from './AuthContext';

const TaskContext = createContext(null);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const { user, refreshUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const fetchedTasks = await mockApi.getTasks(user.id, user.role);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Ошибка загрузки заданий:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (taskData) => {
    try {
      const newTask = await mockApi.createTask({
        ...taskData,
        createdBy: user.id
      });
      await fetchTasks();
      await refreshUser();
      return newTask;
    } catch (error) {
      throw error;
    }
  };

 // Найдите функцию updateTaskStatus и замените её на эту:
  const updateTaskStatus = async (taskId, status, reportData = null) => {
    try {
      // Передаем reportData в mockApi
      await mockApi.updateTaskStatus(taskId, status, user.id, reportData);
      await fetchTasks();
      if (user.role === 'USER') {
        await refreshUser();
      }
    } catch (error) {
      throw error;
    }
  };

  const value = {
    tasks,
    loading,
    fetchTasks,
    createTask,
    updateTaskStatus
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

