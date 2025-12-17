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

  const totalPoints = completedTasks.reduce((sum, task) => sum + (task.points || 0), 0);

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
            Лента помощи ({feedTasks.length})
          </h2>
          {loading ? (
            <div className="text-center py-12 text-gray-500">Загрузка...</div>
          ) : feedTasks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Нет доступных заданий. Проверьте позже!
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Мои задания ({myTasks.length})
            </h2>
            <button
              onClick={() => navigate('/create-task')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Создать задание
            </button>
          </div>
          {loading ? (
            <div className="text-center py-12 text-gray-500">Загрузка...</div>
          ) : myTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">У вас пока нет заданий</p>
              <button
                onClick={() => navigate('/create-task')}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
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
            В работе ({inProgressTasks.length})
          </h2>
          {loading ? (
            <div className="text-center py-12 text-gray-500">Загрузка...</div>
          ) : inProgressTasks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              У вас нет заданий в работе
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
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate">Панель пользователя</h1>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="bg-blue-100 px-2 sm:px-4 py-1 sm:py-2 rounded-lg">
                <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">Мои баллы: </span>
                <span className="text-xs sm:text-sm text-gray-600 sm:hidden">Баллы: </span>
                <span className="font-bold text-blue-600 text-sm sm:text-base">{user.points || 0}</span>
              </div>
              <button
                onClick={logout}
                className="px-2 sm:px-4 py-1.5 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm sm:text-base"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Добро пожаловать, {user.name}!</h2>
          <p className="text-blue-100">
            Ваш баланс баллов: <span className="font-bold text-xl">{user.points || 0}</span>
          </p>
          <p className="text-sm text-blue-100 mt-2">
            Выполнено заданий: {completedTasks.length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 px-4 py-3 text-center font-medium text-sm transition
                    ${
                      activeTab === tab.id
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};
