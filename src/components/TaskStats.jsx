// import { FaTasks, FaHourglassHalf, FaCheckCircle } from "react-icons/fa";

// const TaskStats = ({ total, pending, inProgress, completed, onStatusClick }) => {
//   const stats = [
//     {
//       title: "Total Tasks",
//       value: total,
//       icon: <FaTasks size={28} />,
//       bg: "bg-blue-100",
//       text: "text-blue-800",
//       status: null, // Clicking this shows all tasks
//     },
//     {
//       title: "Pending Tasks",
//       value: pending,
//       icon: <FaHourglassHalf size={28} />,
//       bg: "bg-yellow-100",
//       text: "text-yellow-800",
//       status: "Pending",
//     },
//     {
//       title: "Completed Tasks",
//       value: completed,
//       icon: <FaCheckCircle size={28} />,
//       bg: "bg-green-100",
//       text: "text-green-800",
//       status: "Completed",
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-6 mx-4">
//       {stats.map((stat, index) => (
//         <div
//           key={index}
//           className={`${stat.bg} ${stat.text} p-6 rounded-xl shadow-md flex flex-col items-center justify-center transition hover:scale-105 hover:shadow-lg cursor-pointer`}
//           onClick={() => onStatusClick?.(stat.status)}
//         >
//           <div className="mb-3">{stat.icon}</div>
//           <h3 className="text-lg font-semibold">{stat.title}</h3>
//           <p className="text-3xl font-bold mt-1">{stat.value}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default TaskStats;
import { FaTasks, FaHourglassHalf, FaCheckCircle, FaSpinner } from "react-icons/fa";

const TaskStats = ({ total, pending, inProgress, completed, onStatusClick }) => {
  const stats = [
    {
      title: "Total Tasks",
      value: total,
      icon: <FaTasks size={28} />,
      bg: "bg-blue-100",
      text: "text-blue-800",
      status: null, // Clicking this shows all tasks
    },
    {
      title: "Pending Tasks",
      value: pending,
      icon: <FaHourglassHalf size={28} />,
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      status: "Pending",
    },
    {
      title: "In Progress Tasks",
      value: inProgress,
      icon: <FaSpinner size={28} />,
      bg: "bg-purple-100",
      text: "text-purple-800",
      status: "InProgress",
    },
    {
      title: "Completed Tasks",
      value: completed,
      icon: <FaCheckCircle size={28} />,
      bg: "bg-green-100",
      text: "text-green-800",
      status: "Completed",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-6 mx-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bg} ${stat.text} p-6 rounded-xl shadow-md flex flex-col items-center justify-center transition hover:scale-105 hover:shadow-lg cursor-pointer`}
          onClick={() => onStatusClick?.(stat.status)}
        >
          <div className="mb-3">{stat.icon}</div>
          <h3 className="text-lg font-semibold">{stat.title}</h3>
          <p className="text-3xl font-bold mt-1">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default TaskStats;
