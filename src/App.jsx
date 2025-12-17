import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import Login from './components/LoginForm'; // Исправлен путь!
import { Register } from './pages/Register'; // Исправлен путь!
import AdminDashboard from './components/dashboards/AdminDashboard';
import UserDashboard from './components/dashboards/UserDashboard';
import Navbar from './components/Navbar';
import { CreateTaskForm } from './components/CreateTaskForm';

// Защита маршрутов
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="p-10 text-center">Загрузка...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return (
    <>
      <Navbar />
      <div className="pt-20 px-4 max-w-7xl mx-auto pb-10">
        {children}
      </div>
    </>
  );
};

function AppContent() {
  const { user, isAdmin } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Единый дашборд. Если админ - админка, иначе - обычный кабинет */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          {isAdmin() ? <AdminDashboard /> : <UserDashboard />}
        </PrivateRoute>
      } />

      <Route path="/create-task" element={
        <PrivateRoute>
          <CreateTaskForm />
        </PrivateRoute>
      } />

      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          <AppContent />
        </TaskProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
