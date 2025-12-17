import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTasks } from '../../contexts/TaskContext';
import { TaskCard } from '../TaskCard';
import { useNavigate } from 'react-router-dom';

export const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { tasks, loading } = useTasks();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('feed');

  const feedTasks = tasks.filter(
    task => task.status === 'OPEN' && task.createdBy !== user.id
  );

  const myTasks = tasks.filter(task => task.createdBy === user.id);

  const inProgressTasks = tasks.filter(
    task => task.assignedTo === user.id && ['IN_PROGRESS', 'REVIEW', 'DONE'].includes(task.status)
  );

  const completedTasks = tasks.filter(
    task => task.assignedTo === user.id && task.status === 'DONE'
  );

  const tabs = [
    { id: 'feed', label: 'Лента помощи', count: feedTasks.length },
    { id: 'my', label: 'Мои задания', count: myTasks.length },
    { id: 'progress', label: 'В работе', count: inProgressTasks.length }
  ];

  const renderContent = () => {
    if (activeTab === 'feed') {
      return (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Лента помощи
          </h2>
          {loading ? (
            <div className="text-center py-12 text-gray-500">Загрузка...</div>
          ) : feedTasks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-500">Нет доступных заданий. Проверьте позже!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'my') {
      return (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Мои задания
            </h2>
            <button
              onClick={() => navigate('/create-task')}
              className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-500/20 font-medium"
            >
              Создать задание
            </button>
          </div>
          {loading ? (
            <div className="text-center py-12 text-gray-500">Загрузка...</div>
          ) : myTasks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-500 mb-4">У вас пока нет активных заданий</p>
              <button
                onClick={() => navigate('/create-task')}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-medium"
              >
                Создать первое задание
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'progress') {
      return (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            В работе
          </h2>
          {loading ? (
            <div className="text-center py-12 text-gray-500">Загрузка...</div>
          ) : inProgressTasks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-500">У вас нет заданий в работе</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Volunteer Hub</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-primary-50 px-3 py-1.5 rounded-full border border-primary-100">
                <span className="text-sm text-gray-600 hidden sm:inline">Ваш баланс:</span>
                <span className="font-bold text-primary-700">{user.points || 0}</span>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Зеленая карточка приветствия */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-8 mb-8 text-white shadow-xl shadow-primary-900/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">С возвращением, {user.name}!</h2>
            <p className="text-primary-100 text-lg mb-6">
              Спасибо, что делаете мир лучше.
            </p>
            
            <div className="flex gap-6">
              <div>
                <p className="text-primary-200 text-sm font-medium uppercase tracking-wider">Баланс</p>
                <p className="text-3xl font-bold">{user.points || 0}</p>
              </div>
              <div>
                <p className="text-primary-200 text-sm font-medium uppercase tracking-wider">Помощь оказана</p>
                <p className="text-3xl font-bold">{completedTasks.length} раз</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-1 bg-white p-1 rounded-2xl border border-gray-200 mb-8 max-w-fit shadow-sm">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${activeTab === tab.id ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-600'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {renderContent()}
      </div>
    </div>
  );
};
