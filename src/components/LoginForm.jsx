import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser(login, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (testLogin, testPassword) => {
    setLogin(testLogin);
    setPassword(testPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Volunteer Platform
        </h1>
        <p className="text-center text-gray-600 mb-8">Вход в систему</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Логин
            </label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3 text-center">Быстрый вход для теста:</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('admin', 'admin')}
              className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded transition"
            >
              Админ
            </button>
            <button
              onClick={() => handleQuickLogin('user1', '123')}
              className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded transition"
            >
              Пользователь 1
            </button>
            <button
              onClick={() => handleQuickLogin('user2', '123')}
              className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded transition"
            >
              Пользователь 2
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Нет аккаунта?{' '}
          <a href="#/register" className="text-blue-600 hover:text-blue-700 font-medium">
            Зарегистрироваться
          </a>
        </p>
      </div>
    </div>
  );
};
