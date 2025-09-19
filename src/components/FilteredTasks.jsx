import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllTasks,
  fetchTasksFromFirebase,
  updateTask,
  deleteTaskFromFirebase,
} from "../store/taskSlice";
import { useOutletContext, Link } from "react-router-dom";
import { filterTasks } from "./filterTasks";
import TaskStats from "./TaskStats";
import dayjs from "dayjs";
import "../styles/FilteredTasks.css";
import { useTaskView } from "../context/TaskViewContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const FilteredTasksTable = ({ taskType, title = "All Tasks" }) => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectAllTasks);
  const user = JSON.parse(localStorage.getItem("user"));
  const { taskView } = useTaskView();

  const { statusFilter, priorityFilter } = useOutletContext();

  const [showTasks, setShowTasks] = useState(true);
  const [Users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingTask, setEditingTask] = useState(null);
  const [fullEditingTask, setFullEditingTask] = useState(null);
  const [newRemark, setNewRemark] = useState("");
  const [statusCardFilter, setStatusCardFilter] = useState(null);
  const [filterByExactStartDate, setFilterByExactStartDate] = useState("");
  const [filterByExactEndDate, setFilterByExactEndDate] = useState("");



  useEffect(() => {
    if (user) {
      const typeToFetch = taskView === "Created" ? "Created" : "Received";

      dispatch(
        fetchTasksFromFirebase({
          role: user.role,
          email: user.email,
          type: typeToFetch,
        })
      );
    }
  }, [dispatch, user?.role, user?.email, taskView]);
  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredTasks = filterTasks({
    tasks,
    statusFilter: statusCardFilter || statusFilter,
    priorityFilter,
    type: taskType,
    filterByExactStartDate,
    filterByExactEndDate,
  });

  const fetchUsers = async () => {
    try {
      const usersCol = collection(db, "users");
      const snapshot = await getDocs(usersCol);
      const userList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    if (editingTask?.firebaseId) {
      const updatedTask = {
        ...editingTask,
        lastUpdatedOn: new Date().toISOString(),
      };

      if (updatedTask.status === "Completed") {
        updatedTask.completedDate = new Date().toISOString();
      }

      if (newRemark.trim()) {
        const newRemarkObject = {
          text: newRemark.trim(),
          time: new Date().toISOString(),
        };

        const remarksArray = Array.isArray(updatedTask.remarks)
          ? [...updatedTask.remarks, newRemarkObject]
          : [newRemarkObject];

        updatedTask.remarks = remarksArray;
      }

      dispatch(updateTask(updatedTask));
    }

    setEditingTask(null);
    setNewRemark("");
  };

  const handleFullEditSubmit = (e) => {
    e.preventDefault();

    if (!fullEditingTask?.firebaseId) {
      alert("Error: No task selected for editing.");
      return;
    }

    // Validation
    if (!fullEditingTask.title.trim()) {
      alert("Title is required.");
      return;
    }

    if (
      !fullEditingTask.startDate ||
      isNaN(new Date(fullEditingTask.startDate).getTime())
    ) {
      alert("Please provide a valid start date.");
      return;
    }

    if (
      !fullEditingTask.endDate ||
      isNaN(new Date(fullEditingTask.endDate).getTime())
    ) {
      alert("Please provide a valid due date.");
      return;
    }

    if (
      new Date(fullEditingTask.endDate) < new Date(fullEditingTask.startDate)
    ) {
      alert("Due date cannot be earlier than start date.");
      return;
    }

    if (!fullEditingTask.type) {
      alert("Please select a task type.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(fullEditingTask.assignee)) {
      alert("Please provide a valid assignee email.");
      return;
    }

    const updatedTask = {
      ...fullEditingTask,
      lastUpdatedOn: new Date().toISOString(),
    };

    // Set completedDate based on status
    updatedTask.completedDate =
      updatedTask.status === "Completed" ? new Date().toISOString() : null;

    // Handle remarks
    if (newRemark.trim()) {
      const newRemarkObject = {
        text: newRemark.trim(),
        time: new Date().toISOString(),
      };

      updatedTask.remarks = Array.isArray(updatedTask.remarks)
        ? [...updatedTask.remarks, newRemarkObject]
        : [newRemarkObject];
    }

    try {
      dispatch(updateTask(updatedTask));
      setFullEditingTask(null);
      setNewRemark("");
    } catch (error) {
      alert(`Failed to update task: ${error.message}`);
    }
  };

  const handleDelete = (firebaseId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTaskFromFirebase(firebaseId));
    }
  };

  const searchedTasks = filteredTasks
    .filter((task) => {
      const values = Object.values(task).join(" ").toLowerCase();
      return values.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  const totalPages = Math.ceil(searchedTasks.length / pageSize);
  const paginatedTasks = searchedTasks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const total = filteredTasks.length;
  const pending = filteredTasks.filter(
    (task) => task.status === "Pending"
  ).length;
  const inProgress = filteredTasks.filter(
    (task) => task.status === "InProgress"
  ).length;
  const completed = filteredTasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const columns = [
    { label: "Title", key: "title" },
    { label: "Description", key: "description" },
    {
      label: "Start Date",
      key: "startDate",
      render: (value) =>
        value ? dayjs(value).format("DD MMM YYYY, hh:mm A") : "NA",
    },
    {
      label: "Due Date",
      key: "endDate",
      render: (value) =>
        value ? dayjs(value).format("DD MMM YYYY, hh:mm A") : "NA",
    },
    {
      label: "End Date",
      key: "completedDate",
      render: (value) =>
        value ? dayjs(value).format("DD MMM YYYY, hh:mm A") : "NA",
    },
    {
      label: "Status",
      key: "status",
      render: (value) => (
        <span
          style={{
            color:
              value === "Pending"
                ? "orange"
                : value === "Completed"
                ? "green"
                : "black",
            fontWeight: "600",
          }}
        >
          {value}
        </span>
      ),
    },
    { label: "Priority", key: "priority" },
    { label: "Assignor", key: "assignor" },
    { label: "Assignee", key: "assignee" },
    { label: "Type", key: "type" },
    {
      label: "Remarks",
      key: "remarks",
      render: (value) => {
        if (Array.isArray(value) && value.length > 0) {
          const latest = value[value.length - 1];
          return `${latest.text} (${dayjs(latest.time).format(
            "DD MMM, hh:mm A"
          )})`;
        }
        return "NA";
      },
    },
  ];

  return (
    <div className="filtered-tasks-container">
      <h1 className="heading">
        {title}({taskView})
      </h1>

      <TaskStats
        total={total}
        pending={pending}
        completed={completed}
        inProgress={inProgress}
        onStatusClick={(status) => {
          setStatusCardFilter(status);
          setCurrentPage(1);
        }}
      />

      <div className="date-filter">
        <label>
          Start Date
          <input
            type="date"
            className="date-input"
            value={filterByExactStartDate}
            onChange={(e) => {
              setFilterByExactStartDate(e.target.value);
              setCurrentPage(1);
            }}
          />
        </label>
        <label>
          End Date
          <input
            type="date"
            className="date-input"
            value={filterByExactEndDate}
            onChange={(e) => {
              setFilterByExactEndDate(e.target.value);
              setCurrentPage(1);
            }}
          />
        </label>
        {(filterByExactStartDate || filterByExactEndDate) && (
          <button
            className="clear-date-btn"
            onClick={() => {
              setFilterByExactStartDate("");
              setFilterByExactEndDate("");
            }}
          >
            Clear Date Filters
          </button>
        )}
      </div>

      {filteredTasks.length > 0 ? (
        <>
          <div className="filtered-tasks-header">
            <h2 className="filtered-tasks-title">All Tasks</h2>
            <button
              className="toggle-tasks-btn"
              onClick={() => setShowTasks(!showTasks)}
            >
              {showTasks ? "Hide Tasks" : "Show Tasks"}
            </button>
          </div>

          {showTasks && (
            <>
              <div className="table-controls">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={25}>25 / page</option>
                </select>
              </div>

              <div className="custom-table-wrapper">
                <table className="custom-task-table">
                  <thead>
                    <tr>
                      {taskType !== "Created" && <th>Update</th>}
                      {columns.map((col) => (
                        <th key={col.key}>{col.label}</th>
                      ))}
                      {/* {taskType !== "Created" && <th>Update</th>} */}
                      {taskType !== "Created" && user?.role === "admin" && (
                        <th>Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTasks.map((task, index) => (
                      <tr key={task.firebaseId || task.id || index}>
                        {taskType !== "Created" && (
                          <td>
                            <button
                              disabled={
                                task.status === "Completed" &&
                                user?.role === "user"
                              }
                              style={{
                                backgroundColor:
                                  task.status === "Pending"
                                    ? "#facc15"
                                    : task.status === "Completed"
                                    ? "#22c55e"
                                    : "#3b82f6",
                                color: "white",
                                padding: "6px 12px",
                                border: "none",
                                borderRadius: "6px",
                                cursor:
                                  task.status === "Completed" &&
                                  user?.role === "user"
                                    ? "not-allowed"
                                    : "pointer",
                                opacity:
                                  task.status === "Completed" &&
                                  user?.role === "user"
                                    ? 0.6
                                    : 1,
                              }}
                              onClick={() => {
                                if (
                                  !(
                                    task.status === "Completed" &&
                                    user?.role === "user"
                                  )
                                ) {
                                  setEditingTask(task);
                                  setNewRemark("");
                                }
                              }}
                            >
                              Update
                            </button>
                          </td>
                        )}
                        {columns.map((col) => (
                          <td key={col.key}>
                            {col.render
                              ? col.render(task[col.key])
                              : task[col.key]}
                          </td>
                        ))}
                        {/* {taskType !== "Created" && (
                          <td>
                            <button
                              disabled={
                                task.status === "Completed" &&
                                user?.role === "user"
                              }
                              style={{
                                backgroundColor:
                                  task.status === "Pending"
                                    ? "#facc15"
                                    : task.status === "Completed"
                                    ? "#22c55e"
                                    : "#3b82f6",
                                color: "white",
                                padding: "6px 12px",
                                border: "none",
                                borderRadius: "6px",
                                cursor:
                                  task.status === "Completed" &&
                                  user?.role === "user"
                                    ? "not-allowed"
                                    : "pointer",
                                opacity:
                                  task.status === "Completed" &&
                                  user?.role === "user"
                                    ? 0.6
                                    : 1,
                              }}
                              onClick={() => {
                                if (
                                  !(
                                    task.status === "Completed" &&
                                    user?.role === "user"
                                  )
                                ) {
                                  setEditingTask(task);
                                  setNewRemark("");
                                }
                              }}
                            >
                              Update
                            </button>
                          </td>
                        )} */}
                        {taskType !== "Created" && user?.role === "admin" && (
                          <td>
                            <div className="flex gap-2">
                              <button
                                className="w-20 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
                                onClick={() => {
                                  setFullEditingTask(task);
                                  setNewRemark("");
                                }}
                                aria-label="Edit task"
                              >
                                Edit
                              </button>
                              <button
                                className="w-20 bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition-colors"
                                onClick={() => handleDelete(task.firebaseId)}
                                aria-label="Delete task"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination-controls">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="no-tasks-message">
          <p>
            No {taskType.toLowerCase()} tasks found.{" "}
            {user?.role === "admin" && (
              <Link to="/app/addTask" className="no-tasks-link">
                Add a new task
              </Link>
            )}
          </p>
        </div>
      )}

      {editingTask && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Task</h3>
            <form onSubmit={handleEditSubmit}>
              <label>Status:</label>
              <select
                value={editingTask.status}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, status: e.target.value })
                }
              >
                <option value="Pending">Pending</option>
                <option value="InProgress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <label>Add Remark:</label>
              <input
                type="text"
                value={newRemark}
                onChange={(e) => setNewRemark(e.target.value)}
                placeholder="Add new remark"
              />

              {Array.isArray(editingTask.remarks) &&
                editingTask.remarks.length > 0 && (
                  <div className="existing-remarks">
                    <p>Existing Remarks:</p>
                    <ul>
                      {editingTask.remarks.map((r, i) => (
                        <li key={i}>
                          {r.text} ({dayjs(r.time).format("DD MMM, hh:mm A")})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              <div className="modal-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingTask(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {fullEditingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Full Edit Task
            </h3>
            <form onSubmit={handleFullEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title:
                </label>
                <input
                  type="text"
                  value={fullEditingTask.title}
                  onChange={(e) =>
                    setFullEditingTask({
                      ...fullEditingTask,
                      title: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Task title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description:
                </label>
                <textarea
                  value={fullEditingTask.description}
                  onChange={(e) =>
                    setFullEditingTask({
                      ...fullEditingTask,
                      description: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  aria-label="Task description"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date:
                  </label>
                  <input
                    type="datetime-local"
                    value={dayjs(fullEditingTask.startDate).format(
                      "YYYY-MM-DDTHH:mm"
                    )}
                    onChange={(e) =>
                      setFullEditingTask({
                        ...fullEditingTask,
                        startDate: new Date(e.target.value).toISOString(),
                      })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Task start date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Due Date:
                  </label>
                  <input
                    type="datetime-local"
                    value={dayjs(fullEditingTask.endDate).format(
                      "YYYY-MM-DDTHH:mm"
                    )}
                    onChange={(e) =>
                      setFullEditingTask({
                        ...fullEditingTask,
                        endDate: new Date(e.target.value).toISOString(),
                      })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Task due date"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status:
                  </label>
                  <select
                    value={fullEditingTask.status}
                    onChange={(e) =>
                      setFullEditingTask({
                        ...fullEditingTask,
                        status: e.target.value,
                      })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Task status"
                  >
                    <option value="Pending">Pending</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Priority:
                  </label>
                  <select
                    value={fullEditingTask.priority}
                    onChange={(e) =>
                      setFullEditingTask({
                        ...fullEditingTask,
                        priority: e.target.value,
                      })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Task priority"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700">
                  Assignee (email):
                </label>
                <input
                  type="email"
                  value={fullEditingTask.assignee}
                  onChange={(e) =>
                    setFullEditingTask({
                      ...fullEditingTask,
                      assignee: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Task assignee email"
                />
              </div> */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Assignee:
                </label>
                <select
                  value={fullEditingTask.assignee || ""}
                  onChange={(e) =>
                    setFullEditingTask({
                      ...fullEditingTask,
                      assignee: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Task assignee"
                >
                  <option value="">Select Assignee</option>
                  {Users.map((u) => (
                    <option key={u.id} value={u.email}>
                      {u.name ? `${u.name} (${u.email})` : u.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type:
                </label>
                <select
                  value={fullEditingTask.type}
                  onChange={(e) =>
                    setFullEditingTask({
                      ...fullEditingTask,
                      type: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Task type"
                >
                  <option value="">Select Type</option>
                  <option value="Removal">Removal</option>
                  <option value="Installation">Installation</option>
                  <option value="Health CheckUp">Health CheckUp</option>
                  <option value="Complaint">Complaint</option>
                  <option value="Security Briefing">Security Briefing</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Assignor:
                </label>
                <p className="mt-1 text-gray-600">{fullEditingTask.assignor}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Add Remark:
                </label>
                <input
                  type="text"
                  value={newRemark}
                  onChange={(e) => setNewRemark(e.target.value)}
                  placeholder="Add new remark"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="New remark"
                />
              </div>

              {Array.isArray(fullEditingTask.remarks) &&
                fullEditingTask.remarks.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Existing Remarks:
                    </p>
                    <ul className="list-disc pl-5 text-gray-600">
                      {fullEditingTask.remarks.map((r, i) => (
                        <li key={i}>
                          {r.text} ({dayjs(r.time).format("DD MMM, hh:mm A")})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setFullEditingTask(null)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilteredTasksTable;
