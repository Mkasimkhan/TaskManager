import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllTasks,
  fetchTasksFromFirebase,
  updateTask,
} from "../store/taskSlice";
import { useOutletContext, Link } from "react-router-dom";
import { filterTasks } from "./filterTasks";
import TaskStats from "./TaskStats";
import dayjs from "dayjs";
import "../styles/FilteredTasks.css";

const FilteredTasksTable = ({ taskType, title = "All Tasks" }) => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectAllTasks);
  const user = JSON.parse(localStorage.getItem("user"));

  const { statusFilter, priorityFilter } = useOutletContext();

  const [showTasks, setShowTasks] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingTask, setEditingTask] = useState(null);
  const [newRemark, setNewRemark] = useState("");
  const [statusCardFilter, setStatusCardFilter] = useState(null);
  const [filterByExactStartDate, setFilterByExactStartDate] = useState("");
  const [filterByExactEndDate, setFilterByExactEndDate] = useState("");

  useEffect(() => {
    if (user) {
      dispatch(fetchTasksFromFirebase({ role: user.role, email: user.email }));
    }
  }, [dispatch, user?.role, user?.email]);

  const filteredTasks = filterTasks({
    tasks,
    statusFilter: statusCardFilter || statusFilter,
    priorityFilter,
    type: taskType,
    filterByExactStartDate,
    filterByExactEndDate,
  });

  const handleEditSubmit = (e) => {
    e.preventDefault();

    if (editingTask?.firebaseId) {
      const updatedTask = {
        ...editingTask,
        lastUpdatedOn: new Date().toISOString(),
      };

      // ✅ Set completedDate only when marked as Completed
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
  const pending = filteredTasks.filter((task) => task.status === "Pending").length;
  const completed = filteredTasks.filter((task) => task.status === "Completed").length;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const columns = [
    { label: "Title", key: "title" },
    { label: "Description", key: "description" },
    {
      label: "Start Date",
      key: "startDate",
      render: (value) => (value ? dayjs(value).format("DD MMM YYYY, hh:mm A") : "NA"),
    },
    {
      label: "Due Date",
      key: "endDate",
      render: (value) => (value ? dayjs(value).format("DD MMM YYYY, hh:mm A") : "NA"),
    },
    {
      label: "End Date",
      key: "completedDate",
      render: (value) => (value ? dayjs(value).format("DD MMM YYYY, hh:mm A") : "NA"),
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
    { label: "Assignee", key: "assignee" },
    { label: "Type", key: "type" },
    {
      label: "Remarks",
      key: "remarks",
      render: (value) => {
        if (Array.isArray(value) && value.length > 0) {
          const latest = value[value.length - 1];
          return `${latest.text} (${dayjs(latest.time).format("DD MMM, hh:mm A")})`;
        }
        return "NA";
      },
    },
  ];

  return (
    <div className="filtered-tasks-container">
      <h1 className="heading">{title}</h1>

      <TaskStats
        total={total}
        pending={pending}
        completed={completed}
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
            <button className="toggle-tasks-btn" onClick={() => setShowTasks(!showTasks)}>
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
                      {columns.map((col) => (
                        <th key={col.key}>{col.label}</th>
                      ))}
                      <th>Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTasks.map((task, index) => (
                      <tr key={task.firebaseId || task.id || index}>
                        {columns.map((col) => (
                          <td key={col.key}>
                            {col.render ? col.render(task[col.key]) : task[col.key]}
                          </td>
                        ))}
                        <td>
                          {/* <button
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
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setEditingTask(task);
                              setNewRemark("");
                            }}
                          >
                            Update
                          </button> */}
                          <button
                            disabled={task.status === "Completed" && user?.role === "user"}
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
                                task.status === "Completed" && user?.role === "user"
                                  ? "not-allowed"
                                  : "pointer",
                              opacity:
                                task.status === "Completed" && user?.role === "user"
                                  ? 0.6
                                  : 1,
                            }}
                            onClick={() => {
                              if (!(task.status === "Completed" && user?.role === "user")) {
                                setEditingTask(task);
                                setNewRemark("");
                              }
                            }}
                          >
                            Update
                          </button>


                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination-controls">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                  Prev
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
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
                <option value="Completed">Completed</option>
              </select>

              <label>Add Remark:</label>
              <input
                type="text"
                value={newRemark}
                onChange={(e) => setNewRemark(e.target.value)}
                placeholder="Add new remark"
              />

              {Array.isArray(editingTask.remarks) && editingTask.remarks.length > 0 && (
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
    </div>
  );
};

export default FilteredTasksTable;
