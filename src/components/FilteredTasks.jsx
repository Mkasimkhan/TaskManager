import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAllTasks, fetchTasksFromFirebase } from "../store/taskSlice";
import { useOutletContext, Link } from "react-router-dom";
import { filterTasks } from "./filterTasks";
import TaskStats from "./TaskStats";
import TaskCard from "./TaskCard";
import "../styles/FilteredTasks.css";

const FilteredTasksTable = ({ taskType, title = "All Tasks" }) => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectAllTasks);
  const user = JSON.parse(localStorage.getItem("user"));

  const {
    startDate,
    endDate,
    statusFilter,
    priorityFilter,
  } = useOutletContext();

  const [showTasks, setShowTasks] = useState(true);

  useEffect(() => {
    if (user) {
      dispatch(fetchTasksFromFirebase({ role: user.role, email: user.email }));
    }
  }, [dispatch, user?.role, user?.email]);

  const filteredTasks = filterTasks({
    tasks,
    startDate,
    endDate,
    statusFilter,
    priorityFilter,
    type: taskType,
  });

  const total = filteredTasks.length;
  const pending = filteredTasks.filter(task => task.status === "Pending").length;
  const completed = filteredTasks.filter(task => task.status === "Completed").length;

  return (
    <div className="filtered-tasks-container">
      <TaskStats total={total} pending={pending} completed={completed} />

      {filteredTasks.length > 0 ? (
        <>
          <div className="filtered-tasks-header">
            <h2 className="filtered-tasks-title">{title}</h2>
            <button
              className="toggle-tasks-btn"
              onClick={() => setShowTasks(!showTasks)}
            >
              {showTasks ? "Hide Tasks" : "Show Tasks"}
            </button>
          </div>

          {showTasks && (
            <div className="filtered-tasks-grid-wrapper">
              <div className="filtered-tasks-grid">
                {filteredTasks.map(task => (
                  <TaskCard
                    key={task.firebaseId || task.id}
                    id={task.firebaseId || task.id}
                    title={task.title}
                    description={task.description}
                    startDate={task.startDate}
                    endDate={task.endDate}
                    status={task.status}
                    assignee={task.assignee}
                    priority={task.priority}
                    type={task.type}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="no-tasks-message">
          <p>
            No {taskType.toLowerCase()} tasks found.{" "}
            {user?.role === "admin" && (
              <Link to="/addTask" className="no-tasks-link">
                Add a new task
              </Link>
            )}
          </p>
        </div>
      )}
    </div>

  );
};

export default FilteredTasksTable;


