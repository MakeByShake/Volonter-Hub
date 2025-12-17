import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import { MapPin, Clock, Award } from 'lucide-react'; // Рекомендую использовать иконки (нужно установить lucide-react)

// Если lucide-react не установлен, можно оставить SVG из старого кода, но я покажу структуру для нового дизайна

const statusLabels = {
  PENDING: { label: 'На проверке', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  OPEN: { label: 'Поиск волонтера', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  IN_PROGRESS: { label: 'В работе', color: 'bg-violet-50 text-violet-700 border-violet-200' },
  REVIEW: { label: 'Проверка отчета', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  DONE: { label: 'Выполнено', color: 'bg-gray-100 text-gray-600 border-gray-200' },
  REJECTED: { label: 'Отклонено', color: 'bg-red-50 text-red-700 border-red-200' }
};

export const TaskCard = ({ task }) => {
  const { user, isAdmin, isUser } = useAuth();
  const { updateTaskStatus } = useTasks();

  const handleTakeTask = async () => await updateTaskStatus(task.id, 'IN_PROGRESS');
  constXY handleCompleteTask = async () => await updateTaskStatus(task.id, 'REVIEW');
  const handleApprove = async () => await updateTaskStatus(task.id, 'OPEN');
  const handleReject = async () => await updateTaskStatus(task.id, 'REJECTED');
  const handleConfirmCompletion = async () => await updateTaskStatus(task.id, 'DONE');

  const statusInfo = statusLabels[task.status] || statusLabels.PENDING;

  return (
    <div className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-transparent hover:border-primary-100 overflow-hidden flex flex-col h-full">
      {/* Изображение с оверлеем */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img 
          src={task.imageUrl} 
          alt={task.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
          }}
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.color} shadow-sm backdrop-blur-sm`}>
            {statusInfo.label}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-primary-600 transition-colors">
            {task.title}
          </h3>
          <p className="text-gray-500 text-sm mb-4 line-clamp-3 leading-relaxed">
            {task.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-50 mt-4">
          <span className="flex items-center gap-1.5 hover:text-gray-700 transition-colors">
            {/* SVG иконка локации */}
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {task.city}
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md">
            {/* SVG иконка награды */}
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {task.points} баллов
          </span>
        </div>

        {/* Кнопки действий */}
        <div className="mt-5 pt-0">
          {isAdmin() && (
            <div className="flex gap-2">
              {task.status === 'PENDING' && (
                <>
                  <button onClick={handleApprove} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">Одобрить</button>
                  <button onClick={handleReject} className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 py-2 rounded-lg text-sm font-medium transition-colors">Отклонить</button>
                </>
              )}
              {task.status === 'REVIEW' && (
                <button onClick={handleConfirmCompletion} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">
                  Подтвердить выполнение
                </button>
              )}
            </div>
          )}

          {isUser() && task.status === 'OPEN' && task.createdBy !== user.id && (
            <button onClick={handleTakeTask} className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg text-sm font-medium shadow-primary/20 shadow-lg transition-all active:scale-[0.98]">
              Взять задание
            </button>
          )}

          {isUser() && task.assignedTo === user.id && task.status === 'IN_PROGRESS' && (
             <button onClick={handleCompleteTask} className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-lg text-sm font-medium shadow-violet/20 shadow-lg transition-all active:scale-[0.98]">
              Завершить задание
            </button>
          )}
          
          {isUser() && task.createdBy === user.id && (
            <div className="text-xs text-center text-gray-400 mt-2 font-medium">
              Опубликовано {new Date(task.createdAt).toLocaleDateString('ru-RU')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
