import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent flex items-center gap-2">
              VolunteerHub
            </Link>
            
            {user && !isAdmin() && (
              <div className="hidden md:flex ml-10 space-x-4">
                <Link 
                  to="/dashboard" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/dashboard' 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Лента заданий
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Кнопка создания задания доступна всем обычным юзерам */}
                {!isAdmin() && (
                  <Link 
                    to="/create-task" 
                    className="hidden sm:flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-primary-500/20 active:scale-95"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Создать задание
                  </Link>
                )}
                
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    {!isAdmin() && (
                      <div className="text-xs text-primary-600 font-bold">{user.points} баллов</div>
                    )}
                  </div>
                  <button 
                    onClick={logout}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Выйти"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                  Вход
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-md shadow-primary-500/20">
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
