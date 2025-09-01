// import React, { useEffect, useState } from 'react';
// import { db } from '../firebase';
// import { collection, getDocs } from 'firebase/firestore';
// import { useNavigate } from 'react-router-dom';

// const UserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const usersCol = collection(db, 'users');
//       const snapshot = await getDocs(usersCol);
//       const userList = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setUsers(userList);
//     } catch (err) {
//       console.error('Error fetching users:', err);
//     }
//   };

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">User Dashboard</h1>

      
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
//         <div
//           className="bg-indigo-100 p-6 rounded-lg shadow cursor-pointer hover:bg-indigo-200 transition"
//           onClick={() => navigate('/app/add-user')}
//         >
//           <h2 className="text-xl font-semibold text-indigo-700 mb-2">➕ Add New User</h2>
//           <p className="text-gray-600">Register a new user (admin or regular).</p>
//         </div>

//         <div
//           className="bg-green-100 p-6 rounded-lg shadow cursor-pointer hover:bg-green-200 transition"
//           onClick={() => navigate('/app/user-progress')}
//         >
//           <h2 className="text-xl font-semibold text-green-700 mb-2">📊 User Progress</h2>
//           <p className="text-gray-600">View and filter task progress for each user.</p>
//         </div>

//         <div className="bg-yellow-100 p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold text-yellow-700 mb-2">👥 Users List</h2>
//           <ul className="text-gray-700 list-disc list-inside">
//             {users.map((user) => (
//               <li key={user.id}>
//                 {user.email} — <span className="font-semibold">{user.role}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserManagement;


import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user")); // 👈 logged-in user

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersCol = collection(db, 'users');
      const snapshot = await getDocs(usersCol);
      const userList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

        {/* Admin sees Add User */}
        {storedUser?.role === "admin" && (
          <div
            className="bg-indigo-100 p-6 rounded-lg shadow cursor-pointer hover:bg-indigo-200 transition"
            onClick={() => navigate('/app/add-user')}
          >
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">➕ Add New User</h2>
            <p className="text-gray-600">Register a new user (admin or regular).</p>
          </div>
        )}

        {/* Both admin and user see User Progress */}
        <div
          className="bg-green-100 p-6 rounded-lg shadow cursor-pointer hover:bg-green-200 transition"
          onClick={() => navigate('/app/user-progress')}
        >
          <h2 className="text-xl font-semibold text-green-700 mb-2">📊 User Progress</h2>
          <p className="text-gray-600">View and filter task progress for each user.</p>
        </div>

        {/* Admin sees Users List */}
        {storedUser?.role === "admin" && (
          <div className="bg-yellow-100 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-yellow-700 mb-2">👥 Users List</h2>
            <ul className="text-gray-700 list-disc list-inside">
              {users.map((user) => (
                <li key={user.id}>
                  {user.email} — <span className="font-semibold">{user.role}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
