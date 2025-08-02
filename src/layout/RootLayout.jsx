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

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      {/* <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <TaskHeader
          title={title}
          toggle={toggle}
          setToggle={setToggle}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
        />

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
      </main> */}

      <main className="flex-1 overflow-y-auto bg-gray-50 mb-10">
        {location.pathname !== '/app/addTask' && location.pathname !== '/app/statsTask' && location.pathname !==  '/app/user-management' && location.pathname !==  '/app/add-user' && location.pathname !==  '/app/user-progress' && (
          <TaskHeader
            title={title}
            toggle={toggle}
            setToggle={setToggle}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
          />
        )}

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
