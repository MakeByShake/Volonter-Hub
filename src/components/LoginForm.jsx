// ... импорты

// В return компонента:
<div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
  <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 w-full max-w-md relative overflow-hidden">
    {/* Декоративный элемент сверху */}
    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 to-violet-500"></div>

    <div className="text-center mb-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
        Volunteer Hub
      </h1>
      <p className="text-gray-500">Войдите, чтобы начать помогать</p>
    </div>

    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 ml-1">Логин</label>
        <input
          type="text"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all outline-none text-gray-800 placeholder-gray-400"
          placeholder="Введите ваш логин"
          required
        />
      </div>

      <div className="space-y-2">
         <label className="text-sm font-semibold text-gray-700 ml-1">Пароль</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all outline-none text-gray-800 placeholder-gray-400"
          placeholder="••••••••"
          required
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2">
          <span className="block w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-600 text-white py-3.5 rounded-xl hover:bg-primary-700 transition-all duration-200 font-semibold shadow-lg shadow-primary-500/30 disabled:opacity-70 disabled:shadow-none hover:-translate-y-0.5"
      >
        {loading ? 'Вход...' : 'Войти в аккаунт'}
      </button>
    </form>

    <div className="mt-8 pt-6 border-t border-gray-100">
      {/* ... кнопки быстрого входа можно сделать менее яркими, серыми ... */}
      <p className="text-center text-sm text-gray-500 mt-6">
        Нет аккаунта?{' '}
        <a href="#/register" className="text-primary-600 hover:text-primary-700 font-semibold hover:underline">
          Создать аккаунт
        </a>
      </p>
    </div>
  </div>
</div>
