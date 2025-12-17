import React from 'react';
import UserDashboard from './dashboards/UserDashboard';

// В твоей логике Owner и User - это одно и то же лицо (User может создавать задачи)
// Поэтому просто рендерим UserDashboard
function OwnerDashboard(props) {
  return <UserDashboard {...props} />;
}

export default OwnerDashboard;
