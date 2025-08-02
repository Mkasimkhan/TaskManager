import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAllTasks, fetchTasksFromFirebase } from "../store/taskSlice";
import TaskCard from "./TaskCard";
import { Link, useOutletContext } from "react-router-dom";
import { filterTasks } from "./filterTasks";
import TaskStats from "./TaskStats";

const RemovalTask = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectAllTasks);

  const user = JSON.parse(localStorage.getItem("user"));

  const { startDate, endDate, statusFilter, priorityFilter } = useOutletContext();

  const [showTasks, setShowTasks] = useState(true);

  useEffect(() => {
    if (user) {
      dispatch(fetchTasksFromFirebase({ role: user.role, email: user.email }));
    }
  }, [dispatch, user?.role, user?.email]);

  const filteredRemovalTasks = filterTasks({
    tasks,
    startDate,
    endDate,
    statusFilter,
    priorityFilter,
    type: "Removal",
  });
  const total = filteredRemovalTasks.length;
  const pending = filteredRemovalTasks.filter(task => task.status === "Pending").length;
  const completed = filteredRemovalTasks.filter(task => task.status === "Completed").length;
  return (
    <div className="mx-auto">
      <TaskStats total={total} pending={pending} completed={completed} />
      {filteredRemovalTasks.length > 0 ? (
        <>
          <div className="flex justify-between items-center mt-4 mb-2 mx-4">
            <h2 className="text-xl font-semibold">All Tasks</h2>
            <button
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
              onClick={() => setShowTasks(!showTasks)}
            >
              {showTasks ? "Hide Tasks" : "Show Tasks"}
            </button>
          </div>

          {showTasks && (
            // <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-h-[75vh] pb-4 mt-5">
            <div className="flex justify-center">
              <div className="inline-grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-h-[75vh] pb-4 mt-5 justify-center"
                style={{ maxWidth: "100%" }}
              >
                {filteredRemovalTasks.map((task) => (
                  <TaskCard
                    key={task.firebaseId}
                    id={task.firebaseId}
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
        <div className="text-center mt-24">
          <p className="text-gray-500">
            No removal tasks found.{" "}
            {user?.role === "admin" && (
              <Link to="/addTask" className="text-indigo-500 underline">
                Add a new task
              </Link>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default RemovalTask;
