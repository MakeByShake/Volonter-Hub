import React from 'react';

// Добавлены значения по умолчанию для tasks и users
function AdminDashboard({ tasks = [], users = [], onApprove, onReject }) {
  const pendingTasks = tasks.filter(t => t.status === 'pending_approval');
  
  const getVolunteerName = (id) => {
    if (!id) return '-';
    const user = users.find(u => u.id === id);
    return user ? user.name : 'Unknown';
  };

  return (
    <div>
      <h2 className="mb-4">Панель Администратора</h2>
      
      <div className="row">
        <div className="col-md-12">
          <div className="card shadow-sm">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">Задания на проверке</h5>
            </div>
            <div className="card-body">
              {pendingTasks.length === 0 ? (
                <p className="text-muted">Нет заданий, ожидающих проверки</p>
              ) : (
                <div className="list-group">
                  {pendingTasks.map(task => (
                    <div key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1">{task.title}</h5>
                        <p className="mb-1">{task.description}</p>
                        <small className="text-muted">
                          {/* Исправлено volunteerId -> assignedTo */}
                          Выполнил: <strong>{getVolunteerName(task.assignedTo)}</strong>
                        </small>
                      </div>
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-success"
                          // Исправлено volunteerId -> assignedTo
                          onClick={() => onApprove(task.id, task.assignedTo)}
                        >
                          Подтвердить
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => onReject(task.id)}
                        >
                          Отклонить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-12">
          <h4>Все задачи в системе</h4>
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Статус</th>
                <th>Волонтер</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td>{task.id}</td>
                  <td>{task.title}</td>
                  <td>
                    <span className={`badge bg-${
                      task.status === 'completed' ? 'success' : 
                      task.status === 'open' ? 'secondary' : 
                      task.status === 'pending_approval' ? 'warning' : 'primary'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  {/* Исправлено volunteerId -> assignedTo */}
                  <td>{getVolunteerName(task.assignedTo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
