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
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear localStorage session data
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // if you store tokens

    // Optional: Redirect to login
    navigate("/login");
  }, []);


  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <ProtectedRoute>
          {console.log('Outer ProtectedRoute wrapper')}
          <RootLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: '/', element: <AllTasks /> },
        { path: '/addTask', element: <AddTask /> },
        { path: '/removalTask', element: <RemovalTask /> },
        { path: '/installationTask', element: <InstallationTask /> },
        { path: '/complaintTask', element: <ComplaintTasks /> },
        { path: '/healthcheckupTask', element: <HealthCheckUpTask /> },
        { path: '/securitybriefingTask', element: <SecurityBriefingTasks /> },
        { path: '/statsTask', element: <Dashboard /> },

        // 🔒 Admin-only
        {
          path: '/user-management',
          element: (
            <ProtectedRoute requiredRole="admin">
              {console.log('Inner ProtectedRoute for admin')}
              <UserManagement />
            </ProtectedRoute>
          ),
        },
      ],
    },
    { path: '/login', element: <Login /> },
    { path: '*', element: <Login /> },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
