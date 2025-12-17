import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi'; // Импортируем API
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTasks = () => {
  return useContext(TaskContext);
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const { user } = useAuth();

  // Загрузка задач при старте или смене пользователя
  useEffect(() => {
    const loadTasks = async () => {
      try {
        // mockApi.getTasks возвращает задачи в зависимости от роли
        const fetchedTasks = await mockApi.getTasks(user?.id, user?.role || 'USER');
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Ошибка загрузки задач:", error);
      }
    };
    loadTasks();
  }, [user]); 

  // Метод создания задачи
  const createTask = async (taskData) => {
    const newTask = await mockApi.createTask(taskData);
    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  // Универсальный метод обновления статуса (используется в TaskCard)
  const updateTaskStatus = async (taskId, status, reportData = null) => {
    const updatedTask = await mockApi.updateTaskStatus(taskId, status, user?.id, reportData);
    setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
    return updatedTask;
  };

  // Метод отказа от задачи (используется в TaskCard)
  const abandonTask = async (taskId) => {
    const { task: updatedTask } = await mockApi.abandonTask(taskId, user?.id);
    setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
  };

  const value = {
    tasks,
    createTask,
    updateTaskStatus,
    abandonTask
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
