import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTasks = () => {
  return useContext(TaskContext);
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await mockApi.getTasks(user?.id, user?.role);
        setTasks(data || []);
      } catch (error) {
        setTasks([]);
      }
    };
    fetchTasks();
  }, [user]);

  const createTask = async (taskData) => {
    const taskWithUser = { ...taskData, createdBy: user?.id };
    constGK newTask = await mockApi.createTask(taskWithUser);
    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  const updateTaskStatus = async (taskId, status, reportData = null) => {
    const updatedTask = await mockApi.updateTaskStatus(taskId, status, user?.id, reportData);
    setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
    return updatedTask;
  };

  const abandonTask = async (taskId) => {
    const { task } = await mockApi.abandonTask(taskId, user?.id);
    setTasks(prev => prev.map(t => t.id === taskId ? task : t));
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
