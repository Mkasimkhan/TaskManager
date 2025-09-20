// import { createContext, useState, useContext } from "react";

// const TaskViewContext = createContext();

// export const TaskViewProvider = ({ children }) => {
//   const [taskView, setTaskView] = useState(null); // "created" or "received"

//   return (
//     <TaskViewContext.Provider value={{ taskView, setTaskView }}>
//       {children}
//     </TaskViewContext.Provider>
//   );
// };

// export const useTaskView = () => useContext(TaskViewContext);
import { createContext, useState, useContext, useEffect } from "react";

const TaskViewContext = createContext();

export const TaskViewProvider = ({ children }) => {
  // Load initial value from localStorage
  const [taskView, setTaskView] = useState(() => {
    return localStorage.getItem("taskView") || "Created"; // default to "Created"
  });

  // Whenever taskView changes, save it to localStorage
  useEffect(() => {
    localStorage.setItem("taskView", taskView);
  }, [taskView]);

  return (
    <TaskViewContext.Provider value={{ taskView, setTaskView }}>
      {children}
    </TaskViewContext.Provider>
  );
};

export const useTaskView = () => useContext(TaskViewContext);
