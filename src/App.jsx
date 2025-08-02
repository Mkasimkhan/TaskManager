import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './layout/RootLayout';
import AllTasks from './components/AllTasks';
import RemovalTask from './components/RemovalTask';
import InstallationTask from './components/InstallationTask';
import ComplaintTasks from './components/ComplaintTasks';
import HealthCheckUpTask from './components/HealthCheckUpTask';
import Dashboard from './components/Dashboard';
import AddTask from './components/AddTask';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import UserManagement from './components/UserManagement';
import SecurityBriefingTasks from './components/SecurityBriefingTasks';

const router = createBrowserRouter([
  // Login page on root `/`
  { path: '/', element: <Login /> },

  // Protected routes under /app (or any base path you want)
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
      { path: 'complaintTask', element: <ComplaintTasks /> },
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
    ],
  },

  // Catch all unknown routes and redirect to login (or a 404 page if you want)
  { path: '*', element: <Login /> },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
