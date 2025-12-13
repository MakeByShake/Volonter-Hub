import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AdminDashboard } from '../components/dashboards/AdminDashboard';
import { UserDashboard } from '../components/dashboards/UserDashboard';

export const Dashboard = () => {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return null;
  }

  if (isAdmin()) {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
};
