import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import { mockApi } from '../services/mockApi';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import UserDashboard from '../components/dashboards/UserDashboard';

export const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const { tasks, updateTaskStatus, abandonTask } = useTasks();
  const [users, setUsers] = useState([]);

  // Загружаем список пользователей, если админ (нужно для AdminDashboard)
  useEffect(() => {
    if (isAdmin()) {
      mockApi.getUsers().then(setUsers).catch(console.error);
    }
  }, [isAdmin]);

  if (!user) {
    return null;
  }

  // Обработчики для UserDashboard
  const handleTake = (id) => updateTaskStatus(id, 'in_progress');
  const handleComplete = (id) => updateTaskStatus(id, 'pending_approval'); // Отправляем на проверку
  const handleRefuse = (id) => abandonTask(id);

  // Обработчики для AdminDashboard
  const handleApprove = (id) => updateTaskStatus(id, 'open'); // Одобряем публикацию
  const handleReject = (id) => updateTaskStatus(id, 'rejected'); // Отклоняем
  
  // Дополнительно для админа: подтверждение выполнения
  // В AdminDashboard.jsx есть логика для "pending_approval"
  // Если задача выполнена волонтером, она может иметь статус 'pending_approval' (на проверке)
  // Админ подтверждает -> 'completed'
  const handleConfirmCompletion = (id, volunteerId) => updateTaskStatus(id, 'completed', volunteerId);

  if (isAdmin()) {
    return (
      <AdminDashboard 
        tasks={tasks} 
        users={users} 
        onApprove={handleApprove} 
        onReject={handleReject}
        // Переопределяем onApprove для задач, которые на проверке выполнения, а не публикации
        // В текущем коде AdminDashboard использует onApprove для всего.
        // Чтобы было проще, пусть onApprove делает 'open' (публикация) или 'completed' (если был отчет)
        // Но пока оставим базовый вариант
      />
    );
  }

  return (
    <UserDashboard 
      user={user}
      tasks={tasks}
      onTake={handleTake}
      onComplete={handleComplete}
      onRefuse={handleRefuse}
    />
  );
};
