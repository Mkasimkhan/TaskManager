import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './layout/RootLayout';
import AllTasks from './pages/AllTasks';
import RemovalTask from './pages/RemovalTask';
import InstallationTask from './pages/InstallationTask';
import HealthCheckUpTask from './pages/HealthCheckUpTask';
import Dashboard from './pages/Dashboard';
import AddTask from './pages/AddTask';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import UserManagement from './pages/UserManagement';
import SecurityBriefingTasks from './pages/SecurityBriefingTasks';
import UserProgressPage from './pages/UserprogressPage';
import AddUserPage from './pages/AddUserPage';
import ComplaintTasksPage from './pages/ComplainTasksPage';

const router = createBrowserRouter([
  { path: '/', element: <Login /> },

  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'allTasks', element: <AllTasks /> },
      { path: 'addTask', element: <AddTask /> },
      { path: 'removalTask', element: <RemovalTask /> },
      { path: 'installationTask', element: <InstallationTask /> },
      { path: 'complaintTask', element: <ComplaintTasksPage /> },
      { path: 'healthcheckupTask', element: <HealthCheckUpTask /> },
      { path: 'securitybriefingTask', element: <SecurityBriefingTasks /> },
      { path: 'statsTask', element: <Dashboard /> },
      {
        path: 'user-management',
        element: (
          <ProtectedRoute requiredRole="admin">
            <UserManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'user-progress',
        element: (
          <ProtectedRoute requiredRole="admin">
            <UserProgressPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'add-user',
        element: (
          <ProtectedRoute requiredRole="admin">
            <AddUserPage />
          </ProtectedRoute>
        ),
      },
    ],
  },


  { path: '*', element: <Login /> },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
