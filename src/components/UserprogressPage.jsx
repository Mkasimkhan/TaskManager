import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasksFromFirebase, selectAllTasks } from "../store/taskSlice";
import TaskStats from "./TaskStats";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { filterTasks } from "./filterTasks";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const UserProgressPage = () => {
  const dispatch = useDispatch();
  const allTasks = useSelector(selectAllTasks);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Optional date filters (can add date pickers later)
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userList = querySnapshot.docs.map(doc => doc.data().email);
        setUsers(userList);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch tasks once
  useEffect(() => {
    dispatch(fetchTasksFromFirebase({ role: "admin" }));
  }, [dispatch]);

  // Filter tasks by selected user
  const tasks = selectedUser
    ? allTasks.filter(task => task.assignee === selectedUser)
    : [];

  // Further filtering by status, dates, etc
  const filteredTasks = filterTasks({
    tasks,
    statusFilter,
    priorityFilter: "All",
    startDate,
    endDate,
  });

  const total = filteredTasks.length;
  const pending = filteredTasks.filter(task => task.status === "Pending").length;
  const completed = filteredTasks.filter(task => task.status === "Completed").length;

  // Excel download handler
  const handleDownloadExcel = () => {
    // Map tasks to a plain object for Excel
    const dataForExcel = filteredTasks.map(task => ({
      Title: task.title,
      Description: task.description,
      "Start Date": task.startDate,
      "End Date": task.endDate,
      Status: task.status,
      Priority: task.priority,
      Type: task.type,
    }));

    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

    // Write workbook to binary string
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Create a Blob from the buffer
    const blob = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    // Save the file
    saveAs(blob, `${selectedUser}_tasks.xlsx`);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex justify-center">
        <h2 className="text-4xl font-bold text-indigo-600 mb-6">📊 User Progress</h2>
      </div>

      <div className="mb-6 max-w-sm">
        <label className="block mb-2 font-semibold text-indigo-600">Select User:</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">-- Select a user --</option>
          {users.map(email => (
            <option key={email} value={email}>
              {email}
            </option>
          ))}
        </select>
      </div>

      {selectedUser && (
        <>
          <div className="mb-6 max-w-sm">
            <label className="block mb-2 font-semibold text-indigo-600">Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <TaskStats total={total} pending={pending} completed={completed} />

          <div className="flex justify-end mb-4">
            <button
              onClick={handleDownloadExcel}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
              disabled={filteredTasks.length === 0}
              title={filteredTasks.length === 0 ? "No data to download" : "Download Excel"}
            >
              Download Excel
            </button>
          </div>

          {filteredTasks.length > 0 ? (
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-indigo-600">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-indigo-600">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-indigo-600">Start Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-indigo-600">End Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-indigo-600">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-indigo-600">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-indigo-600">Type</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTasks.map(task => (
                    <tr key={task.firebaseId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.startDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.endDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          task.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : task.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.priority}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 mt-6 text-center">No tasks found for this user.</p>
          )}
        </>
      )}
    </div>
  );
};

export default UserProgressPage;
