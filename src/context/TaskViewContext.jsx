import { createContext, useState, useContext, useEffect } from "react";

const TaskViewContext = createContext();

export const TaskViewProvider = ({ children }) => {
  const [taskView, setTaskView] = useState(() => {
    return localStorage.getItem("taskView") || "Created"; 
  });

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
