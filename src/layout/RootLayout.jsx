import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TaskHeader from '../components/TaskHeader';
import Sidebar from '../components/Sidebar';

const RootLayout = () => {
  const location = useLocation();

  const [toggle, setToggle] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const pageTitles = {
    '/allTasks': 'Task Board',
    '/removalTask': 'Removal Task',
    '/installationTask': 'Installation Task',
    '/healthcheckupTask': 'Health Checkup Task',
    '/complaintTask': 'Complaint Task',
    '/addTask': 'Add New Task',
    '/statsTask': 'Tasks',
  };

  const title = pageTitles[location.pathname] || 'Task Board';

  // ✅ Hide Sidebar if pathname is exactly /app
  const hideSidebar = location.pathname === '/app' || location.pathname === '/app/';

  return (
    <div className="flex h-screen overflow-hidden">
      {!hideSidebar && <Sidebar />}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <Outlet
          context={{
            toggle,
            setToggle,
            startDate,
            setStartDate,
            endDate,
            setEndDate,
            statusFilter,
            setStatusFilter,
            priorityFilter,
            setPriorityFilter,
          }}
        />
      </main>
    </div>
  );
};

export default RootLayout;
