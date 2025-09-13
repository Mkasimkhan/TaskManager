// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import RootLayout from './layout/RootLayout';
// import AllTasks from './pages/AllTasks';
// import RemovalTask from './pages/RemovalTask';
// import InstallationTask from './pages/InstallationTask';
// import HealthCheckUpTask from './pages/HealthCheckUpTask';
// import Dashboard from './pages/Dashboard';
// import AddTask from './pages/AddTask';
// import Login from './pages/Login';
// import ProtectedRoute from './components/ProtectedRoute';
// import UserManagement from './pages/UserManagement';
// import SecurityBriefingTasks from './pages/SecurityBriefingTasks';
// import UserProgressPage from './pages/UserprogressPage';
// import AddUserPage from './pages/AddUserPage';
// import ComplaintTasksPage from './pages/ComplainTasksPage';
// import CreatedTasks from './pages/CreatedTasks';

// const router = createBrowserRouter([
//   { path: '/', element: <Login /> },

//   {
//     path: '/app',
//     element: (
//       <ProtectedRoute>
//         <RootLayout />
//       </ProtectedRoute>
//     ),
//     children: [
//       { path: 'allTasks', element: <AllTasks /> },
//       { path: 'addTask', element: <AddTask /> },
//       { path: 'removalTask', element: <RemovalTask /> },
//       { path: 'installationTask', element: <InstallationTask /> },
//       { path: 'complaintTask', element: <ComplaintTasksPage /> },
//       { path: 'healthcheckupTask', element: <HealthCheckUpTask /> },
//       { path: 'securitybriefingTask', element: <SecurityBriefingTasks /> },
//       { path: 'statsTask', element: <Dashboard /> },
//       { path: 'createdTasks', element: <CreatedTasks /> },
//       { path: 'user-progress', element: <UserProgressPage /> },
//       { path: 'user-management', element: <UserManagement /> },
//       {
//         path: 'add-user',
//         element: (
//           <ProtectedRoute requiredRole="admin">
//             <AddUserPage />
//           </ProtectedRoute>
//         ),
//       },
//     ],
//   },


//   { path: '*', element: <Login /> },
// ]);

// const App = () => {
//   return <RouterProvider router={router} />;
// };

// export default App;
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import AllTasks from "./pages/AllTasks";
import RemovalTask from "./pages/RemovalTask";
import InstallationTask from "./pages/InstallationTask";
import HealthCheckUpTask from "./pages/HealthCheckUpTask";
import Dashboard from "./pages/Dashboard";
import AddTask from "./pages/AddTask";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import UserManagement from "./pages/UserManagement";
import SecurityBriefingTasks from "./pages/SecurityBriefingTasks";
import UserProgressPage from "./pages/UserprogressPage";
import AddUserPage from "./pages/AddUserPage";
import ComplaintTasksPage from "./pages/ComplainTasksPage";
import TaskSelectionPage from "./pages/TaskSelectionPage"; // NEW
import { TaskViewProvider } from "./context/TaskViewContext";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },

  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <TaskSelectionPage /> }, // Show task selection immediately after login
      { path: "allTasks", element: <AllTasks /> },
      { path: "addTask", element: <AddTask /> },
      { path: "removalTask", element: <RemovalTask /> },
      { path: "installationTask", element: <InstallationTask /> },
      { path: "complaintTask", element: <ComplaintTasksPage /> },
      { path: "healthcheckupTask", element: <HealthCheckUpTask /> },
      { path: "securitybriefingTask", element: <SecurityBriefingTasks /> },
      { path: "statsTask", element: <Dashboard /> },
      { path: "user-progress", element: <UserProgressPage /> },
      { path: "user-management", element: <UserManagement /> },
      {
        path: "add-user",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AddUserPage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  { path: "*", element: <Login /> },
]);

const App = () => {
  return (
    <TaskViewProvider>
      <RouterProvider router={router} />
    </TaskViewProvider>
  );
};

export default App;
