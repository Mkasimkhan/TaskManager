// src/pages/TaskSelectionPage.jsx
import { useNavigate } from "react-router-dom";
import { useTaskView } from "../context/TaskViewContext";
import { MdOutlineAssignment, MdOutlineInbox } from "react-icons/md";

const TaskSelectionPage = () => {
  const navigate = useNavigate();
  const { taskView, setTaskView } = useTaskView();

  const handleSelection = (view) => {
    setTaskView(view); // "Created" or "Received"
    navigate("/app/allTasks"); // Go to the tasks page
  };

  const options = [
    {
      label: "Created Tasks",
      value: "Created",
      icon: <MdOutlineAssignment size={36} className="text-white" />,
      color: "bg-indigo-500 hover:bg-indigo-400",
    },
    {
      label: "Received Tasks",
      value: "Received",
      icon: <MdOutlineInbox size={36} className="text-white" />,
      color: "bg-green-500 hover:bg-green-400",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-green-50 gap-8 p-4">
      <h1 className="text-4xl font-extrabold text-gray-800">SELECT TASK VIEW</h1>

      <div className="flex flex-col sm:flex-row gap-6">
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => handleSelection(option.value)}
            className={`flex flex-col items-center justify-center w-64 h-40 rounded-xl shadow-lg cursor-pointer transition-transform transform hover:scale-105
              ${option.color} 
              ${taskView === option.value ? "ring-4 ring-yellow-400" : ""}
            `}
          >
            <div className="mb-4">{option.icon}</div>
            <span className="text-xl font-semibold text-white">{option.label}</span>
            {taskView === option.value && (
              <span className="mt-2 text-sm font-medium text-yellow-100">
                Selected
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskSelectionPage;
