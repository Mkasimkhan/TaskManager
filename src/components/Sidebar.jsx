import "../styles/sidebar.css";
import { GrTask } from "react-icons/gr";
import {
  MdDashboard,
  MdOutlineTaskAlt,
  MdAddTask,
  MdPendingActions,
  MdCloudDone,
  MdQueryStats,
  MdPeople,
  MdOutlineAccessTimeFilled,
  MdEmail,
  MdCode,
  MdReportProblem,
  MdSecurity,
  MdAssignment,
} from "react-icons/md";
import { GrInProgress } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdSwapHoriz } from "react-icons/md";

const Sidebar = () => {
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [isExpanded, setIsExpanded] = useState(window.innerWidth >= 640);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserRole(parsedUser.role);
        setUserEmail(parsedUser.email || "");
      } catch (e) {
        console.warn("Failed to parse user from localStorage", e);
      }
    }

    const handleResize = () => {
      setIsExpanded(window.innerWidth >= 740);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className={`sidebar ${isExpanded ? "expanded" : ""}`}>
      <div>
        <div className="logo">
          <GrTask />
          <span className="label">Task Manager</span>
        </div>

        <nav>
          <ul>
            {[
              {
                to: "/app/allTasks",
                label: "Dashboard",
                icon: <MdDashboard />,
              },
              {
                to: "/app/removalTask",
                label: "Removal Tasks",
                icon: <MdOutlineTaskAlt />,
              },
              {
                to: "/app/installationTask",
                label: "Installation Tasks",
                icon: <MdPendingActions />,
              },
              {
                to: "/app/healthcheckupTask",
                label: "Health Check Up Task",
                icon: <GrInProgress />,
              },
              {
                to: "/app/complaintTask",
                label: "Complaint Tasks",
                icon: <MdReportProblem />,
              },
              {
                to: "/app/securitybriefingTask",
                label: "Security Briefing Tasks",
                icon: <MdSecurity />,
              },
              {
                to: "/app/otherTasks",
                label: "Other Tasks",
                icon: <MdAssignment />,
              },
              {
                to: "/app/statsTask",
                label: "Task Stats",
                icon: <MdQueryStats />,
              },
              {
                to: "/app/addTask",
                label: "Add New Tasks",
                icon: <MdAddTask />,
              },
              {
                to: "/app/user-management",
                label: "User Management",
                icon: <MdPeople />,
              },
            ].map((item, index) => (
              <Link key={index} to={item.to}>
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </Link>
            ))}

            {userRole === "admin" && (
              <>
                
                <Link to="/app/devTasks">
                  <span className="icon"><MdCode /></span>
                  <span className="label">Development Tasks</span>
                </Link>
              </>
            )}
          </ul>
        </nav>
      </div>

      <div className="bottom">
        <div className="item" onClick={() => navigate("/app")}>
          <MdSwapHoriz  className="bottom-icon" />
          <span className="label">Change Type</span>
        </div>
        {userEmail && (
          <div className="item">
            <MdEmail className="bottom-icon" />
            <span className="label">{userEmail}</span>
          </div>
        )}
        <div className="item" onClick={handleLogout}>
          <MdOutlineAccessTimeFilled className="bottom-icon" />
          <span className="label">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
