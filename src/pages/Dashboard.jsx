import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    selectAllTasks,
    fetchTasksFromFirebase,
} from "../store/taskSlice";
import { BarChart } from "@mui/x-charts";
import "../styles/Dashboard.css";

const ALL_TASK_TYPES = [
    "Removal",
    "Complaint",
    "Installation",
    "Health CheckUp",
    "Security Briefing",
];

const Dashboard = () => {
    const dispatch = useDispatch();
    const tasks = useSelector(selectAllTasks);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (user) {
            dispatch(fetchTasksFromFirebase({ role: user.role, email: user.email }))
                .then(() => setLoading(false));
        }
    }, [dispatch, user]);

    const currentUserTasks =
        user?.role === "admin"
            ? tasks
            : tasks.filter((t) => t.assignee === user.email);

    const uniqueUsers = [...new Set(currentUserTasks.map((t) => t.assignee || "Unknown"))];

    if (loading) return <p>Loading...</p>;

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">
                {/* {user.role === "admin" ? "Admin Dashboard" : "User Dashboard"} */}
                Task Stats
            </h2>

            {/* Summary Cards */}
            <div className="dashboard-cards">
                {ALL_TASK_TYPES.map((type) => {
                    const completed = currentUserTasks.filter(
                        (t) => t.type === type && t.status === "Completed"
                    ).length;
                    const pending = currentUserTasks.filter(
                        (t) => t.type === type && t.status === "Pending"
                    ).length;

                    return (
                        <div className="dashboard-card" key={type}>
                            <SummaryCard type={type} completed={completed} pending={pending} />
                        </div>
                    );
                })}
            </div>

            {/* User-wise Charts */}
            {uniqueUsers.map((userEmail) => {
                const userTasks = currentUserTasks.filter((t) => t.assignee === userEmail);

                const completedCounts = ALL_TASK_TYPES.map(
                    (type) =>
                        userTasks.filter(
                            (t) => t.type === type && t.status === "Completed"
                        ).length
                );

                const pendingCounts = ALL_TASK_TYPES.map(
                    (type) =>
                        userTasks.filter(
                            (t) => t.type === type && t.status === "Pending"
                        ).length
                );

                return (
                    <div className="user-chart" key={userEmail}>
                        <h3 className="user-chart-title">Task Overview: <strong>{userEmail}</strong></h3>
                        <BarChart
                            xAxis={[
                                {
                                    id: "taskTypes",
                                    data: ALL_TASK_TYPES,
                                    scaleType: "band",
                                    label: "Task Type",
                                },
                            ]}
                            series={[
                                {
                                    label: "Completed",
                                    data: completedCounts,
                                    color: "#4caf50",
                                },
                                {
                                    label: "Pending",
                                    data: pendingCounts,
                                    color: "#f44336",
                                },
                            ]}
                            height={300}
                            width={800}
                            margin={{ top: 20, bottom: 30, left: 60, right: 20 }}
                            grouping="grouped"
                            slotProps={{
                                legend: {
                                    direction: 'row',
                                    position: {
                                        vertical: 'bottom',
                                        horizontal: 'middle',
                                    },
                                },
                            }}
                        />

                    </div>
                );
            })}
        </div>
    );
};

export default Dashboard;

const SummaryCard = ({ type, completed, pending }) => (
    <div className="summary-card">
        <h3>{type}</h3>
        <div className="summary-stats">
            <div>
                <p className="label">Completed</p>
                <p className="value green">{completed}</p>
            </div>
            <div>
                <p className="label">Pending</p>
                <p className="value red">{pending}</p>
            </div>
        </div>
    </div>
);
