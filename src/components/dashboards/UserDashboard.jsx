import React, { useState } from 'react';

function UserDashboard({ user, tasks, onTake, onComplete, onRefuse }) {
  const [filter, setFilter] = useState('all');

  const myTasks = tasks.filter(t => t.volunteerId === user.id);
  const availableTasks = tasks.filter(t => t.status === 'open');

  return (
    <div>
      <h2>Кабинет Волонтера</h2>
      <div className="mb-4 p-3 bg-light rounded">
        <h4>Мой рейтинг: <span className="badge bg-primary">{user.rating}</span></h4>
      </div>

      <div className="btn-group mb-4">
        <button 
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFilter('all')}
        >
          Доступные задания
        </button>
        <button 
          className={`btn ${filter === 'my' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFilter('my')}
        >
          Мои задания
        </button>
      </div>

      <div className="row">
        {filter === 'all' && availableTasks.map(task => (
          <div key={task.id} className="col-md-6 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{task.title}</h5>
                <p className="card-text">{task.description}</p>
                <p className="text-muted">Статус: {task.status}</p>
                <button 
                  className="btn btn-success w-100"
                  onClick={() => onTake(task.id)}
                >
                  Взять в работу
                </button>
              </div>
            </div>
          </div>
        ))}

        {filter === 'my' && myTasks.map(task => (
          <div key={task.id} className="col-md-6 mb-3">
            <div className="card h-100 border-primary shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{task.title}</h5>
                <p className="card-text">{task.description}</p>
                <p className="text-primary fw-bold">
                  Статус: {task.status === 'pending_approval' ? 'На проверке' : 'В работе'}
                </p>
                
                {task.status === 'in_progress' && (
                  <div className="d-flex gap-2 mt-3">
                    <button 
                      className="btn btn-primary flex-grow-1"
                      onClick={() => onComplete(task.id)}
                    >
                      Выполнить
                    </button>
                    <button 
                      className="btn btn-danger flex-grow-1"
                      onClick={() => onRefuse(task.id)}
                    >
                      Отказаться (-5 баллов)
                    </button>
                  </div>
                )}
                
                {task.status === 'pending_approval' && (
                  <div className="alert alert-info mt-3 m-0">
                    Ожидает подтверждения администратором
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filter === 'all' && availableTasks.length === 0 && (
          <p className="text-center text-muted w-100">Нет доступных заданий</p>
        )}
        {filter === 'my' && myTasks.length === 0 && (
          <p className="text-center text-muted w-100">У вас нет активных заданий</p>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
