import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import Login from './components/LoginForm';
import { Register } from './pages/Register';
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

      {/* ИСПРАВЛЕНИЕ ЗДЕСЬ: */}
      {/* Если юзер есть -> в Dashboard, если нет -> в Login */}
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      
      {/* Если введен несуществующий путь -> тоже на главную (которая сама решит куда дальше) */}
      <Route path="*" element={<Navigate to="/" />} />
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
