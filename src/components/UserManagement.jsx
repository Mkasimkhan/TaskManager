import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, setDoc, doc, getDocs } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

const UserManagement = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    console.log('✅ Entered UserManagement page');
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersCol = collection(db, 'users');
      const userSnapshot = await getDocs(usersCol);
      const userList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    }
    setLoading(false);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      await setDoc(doc(db, 'users', newUser.uid), {
        email,
        role,
      });

      setSuccessMsg(`✅ User ${email} created with role "${role}"`);
      setEmail('');
      setPassword('');
      setRole('user');
      fetchUsers();
    } catch (err) {
      setError('❌ Failed to create user');
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">User Management (Admin Only)</h2>

      <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <select
          className="border px-4 py-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          className="bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition-all"
        >
          Create User
        </button>
      </form>

      {error && <p className="text-red-600 mt-2">{error}</p>}
      {successMsg && <p className="text-green-600 mt-2">{successMsg}</p>}

      <hr className="my-6 border-gray-300" />

      <h3 className="text-xl font-semibold text-gray-700 mb-2">Existing Users:</h3>

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : (
        <ul className="list-disc list-inside text-gray-800">
          {users.map(user => (
            <li key={user.id}>
              {user.email} — <span className="font-semibold">{user.role}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserManagement;
