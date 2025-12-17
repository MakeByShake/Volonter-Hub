import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockTasks } from '../services/mockApi';

const TaskContext = createContext();

export const useTasks = () => {
  return useContext(TaskContext);
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      setTasks(mockTasks);
    }
  }, []);

  const updateTasks = (newTasks) => {
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const createTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      status: 'open',
      createdAt: new Date().toISOString(),
      volunteerId: null
    };
    updateTasks([newTask, ...tasks]);
  };

  const takeTask = (taskId, volunteerId) => {
    const updated = tasks.map(t => 
      t.id === taskId ? { ...t, status: 'in_progress', volunteerId } : t
    );
    updateTasks(updated);
  };

  const completeTask = (taskId) => {
    const updated = tasks.map(t => 
      t.id === taskId ? { ...t, status: 'pending_approval' } : t
    );
    updateTasks(updated);
  };

  const approveTask = (taskId) => {
    const updated = tasks.map(t => 
      t.id === taskId ? { ...t, status: 'completed' } : t
    );
    updateTasks(updated);
  };

  const rejectTask = (taskId) => {
    const updated = tasks.map(t => 
      t.id === taskId ? { ...t, status: 'open', volunteerId: null } : t
    );
    updateTasks(updated);
  };

  const refuseTask = (taskId) => {
    const updated = tasks.map(t => 
      t.id === taskId ? { ...t, status: 'open', volunteerId: null } : t
    );
    updateTasks(updated);
  };

  const value = {
    tasks,
    createTask,
    takeTask,
    completeTask,
    approveTask,
    rejectTask,
    refuseTask
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
