import React, { useState } from 'react';
import { useTasks } from '../contexts/TaskContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const CreateTaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [points, setPoints] = useState(50);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { createTask } = useTasks();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createTask({
        title,
        description,
        city,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400',
        points: parseInt(points)
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Ошибка создания задания');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Создать заявку на помощь</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Заголовок *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            placeholder="Например: Помощь в уборке квартиры"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Описание *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            placeholder="Опишите, какая помощь вам нужна..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Город *
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            placeholder="Москва"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ссылка на фото
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">Если не указано, будет использовано изображение по умолчанию</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Бонусы за выполнение *
          </label>
          <div className="mb-2 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Ваш баланс: <span className="font-bold text-blue-600">{user?.points || 0} очков</span>
            </p>
            {parseInt(points) > (user?.points || 0) && (
              <p className="text-xs text-red-600 mt-1">
                Недостаточно очков! У вас {user?.points || 0}, требуется {points}
              </p>
            )}
          </div>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            min="1"
            max={user?.points || 1000}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Укажите количество бонусов, которые вы отдадите за выполнение задания. Бонусы будут списаны с вашего баланса при создании заявки.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
          >
            {loading ? 'Создание...' : 'Создать заявку'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};
