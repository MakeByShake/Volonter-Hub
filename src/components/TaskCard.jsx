import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';

const statusLabels = {
  PENDING: { label: 'На проверке', color: 'bg-yellow-100 text-yellow-800' },
  OPEN: { label: 'Поиск волонтера', color: 'bg-blue-100 text-blue-800' },
  IN_PROGRESS: { label: 'В работе', color: 'bg-purple-100 text-purple-800' },
  REVIEW: { label: 'На проверке выполнения', color: 'bg-orange-100 text-orange-800' },
  DONE: { label: 'Выполнено', color: 'bg-green-100 text-green-800' },
  REJECTED: { label: 'Отклонено', color: 'bg-red-100 text-red-800' }
};

export const TaskCard = ({ task }) => {
  const { user, isAdmin, isUser } = useAuth();
  const { updateTaskStatus } = useTasks();

  const handleTakeTask = async () => {
    await updateTaskStatus(task.id, 'IN_PROGRESS');
  };

  const handleCompleteTask = async () => {
    await updateTaskStatus(task.id, 'REVIEW');
  };

  const handleApprove = async () => {
    await updateTaskStatus(task.id, 'OPEN');
  };

  const handleReject = async () => {
    await updateTaskStatus(task.id, 'REJECTED');
  };

  const handleConfirmCompletion = async () => {
    await updateTaskStatus(task.id, 'DONE');
  };

  const statusInfo = statusLabels[task.status] || statusLabels.PENDING;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img 
          src={task.imageUrl} 
          alt={task.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
          }}
        />
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800 flex-1">{task.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {task.city}
          </span>
          <span className="font-medium text-blue-600">{task.points} баллов</span>
        </div>

        {isAdmin() && (
          <div className="flex gap-2">
            {task.status === 'PENDING' && (
              <>
                <button
                  onClick={handleApprove}
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  Одобрить
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Отклонить
                </button>
              </>
            )}
            {task.status === 'REVIEW' && (
              <button
                onClick={handleConfirmCompletion}
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Подтвердить выполнение
              </button>
            )}
          </div>
        )}

        {isUser() && task.status === 'OPEN' && task.createdBy !== user.id && (
          <button
            onClick={handleTakeTask}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Взять задание
          </button>
        )}

        {isUser() && task.assignedTo === user.id && task.status === 'IN_PROGRESS' && (
          <button
            onClick={handleCompleteTask}
            className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
          >
            Завершить
          </button>
        )}

        {isUser() && task.createdBy === user.id && (
          <div className="text-xs text-gray-500 mt-2">
            Создано: {new Date(task.createdAt).toLocaleDateString('ru-RU')}
          </div>
        )}
      </div>
    </div>
  );
};
