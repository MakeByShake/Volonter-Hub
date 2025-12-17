import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LoginForm() {
  const [loginData, setLoginData] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(loginData, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 to-primary-600"></div>
        
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Вход</h2>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Логин</label>
            <input 
              type="text" 
              className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all outline-none"
              value={loginData}
              onChange={(e) => setLoginData(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Пароль</label>
            <input 
              type="password" 
              className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3.5 rounded-xl hover:bg-primary-700 transition-all font-semibold shadow-lg shadow-primary-500/30 disabled:opacity-70 mt-4"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Нет аккаунта? <Link to="/register" className="text-primary-600 hover:underline font-semibold">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
