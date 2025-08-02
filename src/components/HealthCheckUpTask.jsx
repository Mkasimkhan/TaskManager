// import { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { selectAllTasks, fetchTasksFromFirebase } from "../store/taskSlice";
// import { useOutletContext, Link } from "react-router-dom";
// import TaskCard from "./TaskCard";
// import { filterTasks } from "./filterTasks";
// import TaskStats from "./TaskStats";

// const HealthCheckUpTask = () => {
//   const dispatch = useDispatch();
//   const tasks = useSelector(selectAllTasks);

//   const user = JSON.parse(localStorage.getItem("user"));

//   const {
//     startDate,
//     endDate,
//     statusFilter,
//     priorityFilter,
//   } = useOutletContext();

//   const [showTasks, setShowTasks] = useState(true);

//   useEffect(() => {
//     if (user) {
//       dispatch(fetchTasksFromFirebase({ role: user.role, email: user.email }));
//     }
//   }, [dispatch, user?.role, user?.email]);

//   const filteredHealthCheckupTasks = filterTasks({
//     tasks,
//     startDate,
//     endDate,
//     statusFilter,
//     priorityFilter,
//     type: "Health CheckUp",
//   });

//   const total = filteredHealthCheckupTasks.length;
//   const pending = filteredHealthCheckupTasks.filter((task) => task.status === "Pending").length;
//   const completed = filteredHealthCheckupTasks.filter((task) => task.status === "Completed").length;

//   return (
//     <div className="mx-auto px-4">
//       <TaskStats total={total} pending={pending} completed={completed} />

//       {filteredHealthCheckupTasks.length > 0 ? (
//         <>
//           <div className="flex justify-between items-center mt-4 mb-2">
//             <h2 className="text-xl font-semibold">All Tasks</h2>
//             <button
//               className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
//               onClick={() => setShowTasks(!showTasks)}
//             >
//               {showTasks ? "Hide Tasks" : "Show Tasks"}
//             </button>
//           </div>

//           {showTasks && (
//             <div className="flex justify-center">
//               <div
//                 className="grid gap-6 mt-5 pb-4 max-h-[75vh] justify-center w-full"
//                 style={{
//                   gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//                 }}
//               >
//                 {filteredHealthCheckupTasks.map((task) => (
//                   <TaskCard
//                     key={task.firebaseId}
//                     id={task.firebaseId}
//                     title={task.title}
//                     description={task.description}
//                     startDate={task.startDate}
//                     endDate={task.endDate}
//                     status={task.status}
//                     assignee={task.assignee}
//                     priority={task.priority}
//                     type={task.type}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}
//         </>
//       ) : (
//         <div className="text-center mt-24">
//           <p className="text-gray-500">
//             No health checkup tasks found.{" "}
//             {user?.role === "admin" && (
//               <Link to="/addTask" className="text-indigo-500 underline">
//                 Add a new task
//               </Link>
//             )}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HealthCheckUpTask;

import FilteredTasksTable from "./FilteredTasks";

const HealthCheckUpTask = () => {
  return <FilteredTasksTable taskType="Health CheckUp" title="All Tasks" />;
};

export default HealthCheckUpTask;