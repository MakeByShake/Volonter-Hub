const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEYS = {
  USERS: 'volunteer_platform_users',
  TASKS: 'volunteer_platform_tasks',
  INITIALIZED: 'volunteer_platform_initialized'
};

const seedData = () => {
  const defaultUsers = [
    {
      id: '1',
      login: 'admin',
      password: 'admin',
      role: 'ADMIN',
      name: 'Администратор',
      email: 'admin@platform.ru'
    },
    {
      id: '2',
      login: 'user1',
      password: '123',
      role: 'USER',
      name: 'Иван Петров',
      email: 'user1@platform.ru',
      points: 200
    },
    {
      id: '3',
      login: 'user2',
      password: '123',
      role: 'USER',
      name: 'Мария Иванова',
      email: 'user2@platform.ru',
      points: 200
    }
  ];

  // Исправлены статусы на lowercase, чтобы соответствовать UserDashboard.jsx
  const defaultTasks = [
    {
      id: '1',
      title: 'Помощь в уборке квартиры',
      description: 'Нужна помощь в уборке квартиры пожилой женщине. Требуется помощь с генеральной уборкой.',
      city: 'Москва',
      imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
      status: 'open', 
      createdBy: '3',
      assignedTo: null,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      points: 50
    },
    {
      id: '2',
      title: 'Доставка продуктов',
      description: 'Нужна помощь с доставкой продуктов из магазина. Живу на 3 этаже, лифт не работает.',
      city: 'Санкт-Петербург',
      imageUrl: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400',
      status: 'pending_approval',
      createdBy: '3',
      assignedTo: null,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      points: 30
    },
    {
      id: '3',
      title: 'Помощь в ремонте',
      description: 'Требуется помощь с мелким ремонтом в квартире. Нужно повесить полки и починить кран.',
      city: 'Москва',
      imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400',
      status: 'completed',
      createdBy: '3',
      assignedTo: '2',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      completedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      points: 75
    },
    {
      id: '4',
      title: 'Прогулка с собакой',
      description: 'Нужна помощь с выгулом собаки. Не могу выйти из дома по состоянию здоровья.',
      city: 'Казань',
      imageUrl: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400',
      status: 'open',
      createdBy: '3',
      assignedTo: null,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      points: 25
    }
  ];

  let users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  let tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');

  defaultUsers.forEach(defaultUser => {
    const existingUser = users.find(u => u.id === defaultUser.id || u.login === defaultUser.login);
    if (existingUser) {
      Object.assign(existingUser, defaultUser);
    } else {
      users.push(defaultUser);
    }
  });

  if (tasks.length === 0) {
    tasks = defaultTasks;
  }
  
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

seedData();

export const mockApi = {
  async login(login, password) {
    await delay(500);
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find(u => (u.login === login || u.email === login) && u.password === password);
    
    if (!user) {
      throw new Error('Неверный логин или пароль');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async register(userData) {
    await delay(500);
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    
    if (users.find(u => u.login === userData.login)) {
      throw new Error('Пользователь с таким логином уже существует');
    }
    
    const newUser = {
      id: String(Date.now()),
      ...userData,
      role: 'USER',
      points: 200
    };
    
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  async getTasks(userId, role) {
    await delay(500);
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
    
    if (role === 'ADMIN') {
      return tasks;
    }
    
    // Для обычного юзера возвращаем всё, фильтрация будет на фронте или здесь
    // Возвращаем все задачи, чтобы лента работала корректно
    return tasks;
  },

  // Новый метод для админки
  async getUsers() {
    await delay(300);
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    return users.map(({ password, ...u }) => u);
  },

  async createTask(taskData) {
    await delay(500);
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    
    const creator = users.find(u => u.id === taskData.createdBy);
    
    // Списание баллов (если нужно)
    if (creator) {
       const pointsToDeduct = parseInt(taskData.points) || 0;
       if (creator.points >= pointsToDeduct) {
         creator.points -= pointsToDeduct;
         localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
       }
    }
    
    const newTask = {
      id: String(Date.now()),
      ...taskData,
      status: 'pending_approval', // Статус для модерации
      assignedTo: null,
      createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    
    return newTask;
  },

  async updateTaskStatus(taskId, status, userId = null, reportData = null) {
    await delay(300);
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) throw new Error('Задание не найдено');
    
    task.status = status;
    
    if (status === 'in_progress' && userId) {
      task.assignedTo = userId;
    }
    
    if (status === 'completed' && userId) {
        // Начисление баллов исполнителю
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        const user = users.find(u => u.id === userId);
        if (user) {
            user.points = (user.points || 0) + (task.points || 0);
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        }
    }

    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    return task;
  },

  async abandonTask(taskId, volunteerId) {
    await delay(300);
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
        task.status = 'open';
        task.assignedTo = null;
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    }
    return { task };
  }
};
