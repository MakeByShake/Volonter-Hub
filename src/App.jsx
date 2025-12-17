import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/LoginForm';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import OwnerDashboard from './components/OwnerDashboard';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedUsers = localStorage.getItem('users');
    const storedTasks = localStorage.getItem('tasks');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedUsers) setUsers(JSON.parse(storedUsers));
    if (storedTasks) setTasks(JSON.parse(storedTasks));
  }, []);

  const saveData = (newUsers, newTasks) => {
    if (newUsers) {
      setUsers(newUsers);
      localStorage.setItem('users', JSON.stringify(newUsers));
    }
    if (newTasks) {
      setTasks(newTasks);
      localStorage.setItem('tasks', JSON.stringify(newTasks));
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const handleRegister = (newUser) => {
    const updatedUsers = [...users, { ...newUser, id: Date.now(), rating: 0 }];
    saveData(updatedUsers, null);
    handleLogin(updatedUsers[updatedUsers.length - 1]);
  };

  const handleCreateTask = (task) => {
    const newTask = { 
      ...task, 
      id: Date.now(), 
      status: 'open', 
      ownerId: user.id, 
      volunteerId: null 
    };
    const updatedTasks = [...tasks, newTask];
    saveData(null, updatedTasks);
  };

  const handleTakeTask = (taskId) => {
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, status: 'in_progress', volunteerId: user.id } : t
    );
    saveData(null, updatedTasks);
  };

  const handleCompleteTask = (taskId) => {
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, status: 'pending_approval' } : t
    );
    saveData(null, updatedTasks);
  };

  const handleRefuseTask = (taskId) => {
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, status: 'open', volunteerId: null } : t
    );
    
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, rating: Math.max(0, u.rating - 5) } : u
    );

    const currentUserUpdated = updatedUsers.find(u => u.id === user.id);
    setUser(currentUserUpdated);
    localStorage.setItem('currentUser', JSON.stringify(currentUserUpdated));

    saveData(updatedUsers, updatedTasks);
  };

  const handleApproveTask = (taskId, volunteerId) => {
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, status: 'completed' } : t
    );
    
    const updatedUsers = users.map(u => 
      u.id === volunteerId ? { ...u, rating: u.rating + 10 } : u
    );

    saveData(updatedUsers, updatedTasks);
  };

  const handleRejectTask = (taskId) => {
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, status: 'open', volunteerId: null } : t
    );
    saveData(null, updatedTasks);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Navigate to={user ? `/${user.role}` : "/login"} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} users={users} />} />
          <Route path="/register" element={<Register onRegister={handleRegister} />} />
          
          <Route path="/admin" element={
            user && user.role === 'admin' ? (
              <AdminDashboard 
                tasks={tasks} 
                users={users} 
                onApprove={handleApproveTask} 
                onReject={handleRejectTask} 
              />
            ) : <Navigate to="/login" />
          } />

          <Route path="/volunteer" element={
            user && user.role === 'volunteer' ? (
              <UserDashboard 
                user={user} 
                tasks={tasks} 
                onTake={handleTakeTask} 
                onComplete={handleCompleteTask}
                onRefuse={handleRefuseTask}
              />
            ) : <Navigate to="/login" />
          } />

          <Route path="/owner" element={
            user && user.role === 'owner' ? (
              <OwnerDashboard 
                user={user} 
                tasks={tasks} 
                onCreate={handleCreateTask} 
              />
            ) : <Navigate to="/login" />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
