import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasksFromFirebase, selectAllTasks } from "../store/taskSlice";
import TaskStats from "../components/TaskStats";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { filterTasks } from "../components/filterTasks";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";

const columns = [
  { header: "Title", key: "title" },
  { header: "Description", key: "description" },
  {
    header: "Start Date",
    key: "startDate",
    render: (value) =>
      value ? dayjs(value).format("DD MMM YYYY, hh:mm A") : "NA",
  },
  {
    header: "Due Date",
    key: "endDate",
    render: (value) =>
      value ? dayjs(value).format("DD MMM YYYY, hh:mm A") : "NA",
  },
  {
    header: "End Date",
    key: "completedDate",
    render: (value) =>
      value ? dayjs(value).format("DD MMM YYYY, hh:mm A") : "NA",
  },
  { header: "Status", key: "status" },
  { header: "Priority", key: "priority" },
  { header: "Type", key: "type" },
  { header: "Assignor", key: "assignor" },
  {
    header: "Remarks",
    key: "remarks",
    render: (remarks) =>
      Array.isArray(remarks) && remarks.length > 0
        ? remarks
            .map(
              (r) =>
                `${r.text} (${
                  r.time ? dayjs(r.time).format("DD MMM, h:mm A") : "N/A"
                })`
            )
            .join(" | ")
        : "—",
  },
];

const UserProgressPage = () => {
  const dispatch = useDispatch();
  const allTasks = useSelector(selectAllTasks);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userList = querySnapshot.docs.map((doc) => doc.data().email);
        setUsers(userList);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    dispatch(fetchTasksFromFirebase({ role: "admin" }));
  }, [dispatch]);

  const tasks = selectedUser
    ? allTasks.filter((task) => task.assignee === selectedUser)
    : [];

  const filteredTasks = filterTasks({
    tasks,
    statusFilter,
    priorityFilter: "All",
    startDate,
    endDate,
  });

  const total = filteredTasks.length;
  const pending = filteredTasks.filter(
    (task) => task.status === "Pending"
  ).length;
  const completed = filteredTasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const handleDownloadExcel = () => {
    const dataForExcel = filteredTasks.map((task) => {
      const row = {};
      columns.forEach((col) => {
        row[col.header] = col.render
          ? typeof col.render(task[col.key]) === "string"
            ? col.render(task[col.key])
            : "" // Skip complex JSX for Excel
          : task[col.key] ?? "";
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, `${selectedUser}_tasks.xlsx`);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex justify-center">
        <h2 className="text-4xl font-bold text-indigo-600 mb-6">
          📊 User Progress
        </h2>
      </div>

      <div className="mb-6 max-w-sm">
        <label className="block mb-2 font-semibold text-indigo-600">
          Select User:
        </label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">-- Select a user --</option>
          {users.map((email) => (
            <option key={email} value={email}>
              {email}
            </option>
          ))}
        </select>
      </div>

      {selectedUser && (
        <>
          <div className="mb-6 max-w-sm">
            <label className="block mb-2 font-semibold text-indigo-600">
              Filter by Status:
            </label>
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
              title={
                filteredTasks.length === 0
                  ? "No data to download"
                  : "Download Excel"
              }
            >
              Download Excel
            </button>
          </div>

          {filteredTasks.length > 0 ? (
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
                <thead className="bg-indigo-600">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-white"
                      >
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTasks.map((task) => (
                    <tr
                      key={task.firebaseId}
                      className="hover:bg-gray-50 align-top"
                    >
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                        >
                          {col.render
                            ? col.render(task[col.key])
                            : task[col.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 mt-6 text-center">
              No tasks found for this user.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default UserProgressPage;
