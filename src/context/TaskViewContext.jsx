import { createContext, useState, useContext } from "react";

const TaskViewContext = createContext();

export const TaskViewProvider = ({ children }) => {
  const [taskView, setTaskView] = useState(null); // "created" or "received"

  return (
    <TaskViewContext.Provider value={{ taskView, setTaskView }}>
      {children}
    </TaskViewContext.Provider>
  );
};

export const useTaskView = () => useContext(TaskViewContext);
