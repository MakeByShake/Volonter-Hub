import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import Login from './components/LoginForm';
// Обрати внимание: Register импортируется из pages и как именованный экспорт (в фигурных скобках)
import { Register } from './pages/Register'; 
import AdminDashboard from './components/dashboards/AdminDashboard';
import UserDashboard from './components/dashboards/UserDashboard';
import Navbar from './components/Navbar';
import { CreateTaskForm } from './components/CreateTaskForm';

// Компонент для защиты роутов
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Загрузка...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return (
    <>
      <Navbar />
      <div className="pt-20 px-4 max-w-7xl mx-auto">
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
