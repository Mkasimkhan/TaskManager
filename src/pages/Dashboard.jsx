import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Chart,
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    ArcElement,
    PieController,
    LineElement,
    PointElement,
    RadialLinearScale,
    RadarController,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import {
    selectAllTasks,
    fetchTasksFromFirebase,
} from "../store/taskSlice";
import "../styles/Dashboard.css";

// Register Chart.js components
Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    ArcElement,
    PieController,
    LineElement,
    PointElement,
    RadialLinearScale,
    RadarController,
    Title,
    Tooltip,
    Legend,
    Filler
);

// SVG Icons
const TrendingUp = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const Users = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197v1z" />
    </svg>
);

const CheckCircle = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const Clock = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const AlertCircle = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ALL_TASK_TYPES = [
    "Removal",
    "Complaint",
    "Installation",
    "Health CheckUp",
    "Security Briefing",
];

const COLORS = ['#3b82f6', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'];

const KPICard = ({ title, value, icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-lg p-3 flex items-center space-x-3 transform transition-transform hover:scale-105 h-30" style={{ height: "120px" }}>
        <div className={`${color} p-2 rounded-full text-white h-12 w-12 flex justify-center items-center`}>{icon}</div>
        <div>
            <h3 className="text-md font-medium text-gray-600">{title}</h3>
            <p className="text-lg font-bold text-gray-800">{value}</p>
            {/* <p className={`text-xs ${trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{trend}</p> */}
        </div>
    </div>
);

const Dashboard = () => {
    const dispatch = useDispatch();
    const tasks = useSelector(selectAllTasks);
    const taskStatus = useSelector(state => state.tasks?.status);
    const taskError = useSelector(state => state.tasks?.error);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedUser, setSelectedUser] = useState('');
    const [showModal, setShowModal] = useState(false);
    const modalChartRef = useRef(null);
    const modalCanvasRef = useRef(null);

    const barChartRef = useRef(null);
    const pieChartRef = useRef(null);
    const teamChartRef = useRef(null);
    const radarChartRef = useRef(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
            dispatch(fetchTasksFromFirebase({ role: storedUser.role, email: storedUser.email }))
                .then(() => setLoading(false))
                .catch((err) => {
                    setError("Failed to fetch tasks. Please try again.");
                    setLoading(false);
                });
        } else {
            setError("User not found. Please log in.");
            setLoading(false);
        }
    }, [dispatch]);

    const currentUserTasks = user?.role === "admin" ? tasks : tasks.filter((t) => t.assignee === user?.email);
    const uniqueUsers = [...new Set(currentUserTasks.map((t) => t.assignee || "Unknown"))];

    // Calculate KPIs
    const totalTasks = currentUserTasks.length;
    const completedTasks = currentUserTasks.filter(t => t.status === "Completed").length;
    const pendingTasks = currentUserTasks.filter(t => t.status === "Pending").length;
    const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

    // Calculate trends
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const prev7Days = new Date(last7Days.getTime() - 7 * 24 * 60 * 60 * 1000);

    const tasksLast7Days = currentUserTasks.filter(t => new Date(t.createdAt) >= last7Days);
    const tasksPrev7Days = currentUserTasks.filter(t => new Date(t.createdAt) >= prev7Days && new Date(t.createdAt) < last7Days);

    const calculateTrend = (current, previous) => {
        if (previous === 0) return current > 0 ? "+100%" : "0%";
        const percentage = ((current - previous) / previous * 100).toFixed(1);
        return percentage >= 0 ? `+${percentage}%` : `${percentage}%`;
    };

    const totalTasksTrend = calculateTrend(tasksLast7Days.length, tasksPrev7Days.length);
    const completedTasksTrend = calculateTrend(
        tasksLast7Days.filter(t => t.status === "Completed").length,
        tasksPrev7Days.filter(t => t.status === "Completed").length
    );
    const pendingTasksTrend = calculateTrend(
        tasksLast7Days.filter(t => t.status === "Pending").length,
        tasksPrev7Days.filter(t => t.status === "Pending").length
    );
    const completionRateLast7Days = tasksLast7Days.length > 0
        ? (tasksLast7Days.filter(t => t.status === "Completed").length / tasksLast7Days.length * 100).toFixed(1)
        : 0;
    const completionRatePrev7Days = tasksPrev7Days.length > 0
        ? (tasksPrev7Days.filter(t => t.status === "Completed").length / tasksPrev7Days.length * 100).toFixed(1)
        : 0;
    const completionRateTrend = calculateTrend(completionRateLast7Days, completionRatePrev7Days);

    const taskTypeData = ALL_TASK_TYPES.map(type => {
        const completed = currentUserTasks.filter(t => t.type === type && t.status === "Completed").length;
        const pending = currentUserTasks.filter(t => t.type === type && t.status === "Pending").length;
        return { type, completed, pending, total: completed + pending };
    });

    useEffect(() => {
        if (!loading && !error) {
            createCharts();
        }

        return () => {
            if (barChartRef.current) barChartRef.current.destroy();
            if (pieChartRef.current) pieChartRef.current.destroy();
            if (teamChartRef.current) teamChartRef.current.destroy();
            if (radarChartRef.current) radarChartRef.current.destroy();
            if (modalChartRef.current) modalChartRef.current.destroy();
        };
    }, [loading, error, currentUserTasks, selectedType]);

    const createCharts = () => {
        // Bar Chart: Task Distribution by Type
        const barCtx = document.getElementById('barChart');
        if (barCtx && !barChartRef.current) {
            barChartRef.current = new Chart(barCtx, {
                type: 'bar',
                data: {
                    labels: selectedType ? [selectedType] : taskTypeData.map(item => item.type),
                    datasets: [
                        {
                            label: 'Completed',
                            data: selectedType
                                ? [taskTypeData.find(item => item.type === selectedType)?.completed || 0]
                                : taskTypeData.map(item => item.completed),
                            backgroundColor: 'rgba(34, 197, 94, 0.8)',
                            borderColor: 'rgba(34, 197, 94, 1)',
                            borderWidth: 1,
                            borderRadius: 4
                        },
                        {
                            label: 'Pending',
                            data: selectedType
                                ? [taskTypeData.find(item => item.type === selectedType)?.pending || 0]
                                : taskTypeData.map(item => item.pending),
                            backgroundColor: 'rgba(249, 115, 22, 0.8)',
                            borderColor: 'rgba(249, 115, 22, 1)',
                            borderWidth: 1,
                            borderRadius: 4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: { font: { size: 10 } }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            titleColor: '#1e40af',
                            bodyColor: '#1e40af',
                            borderColor: '#bfdbfe',
                            borderWidth: 1
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(0, 0, 0, 0.05)' },
                            ticks: { font: { size: 10 } }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { font: { size: 10 } }
                        }
                    }
                }
            });
        }

        // Pie Chart: Task Volume Distribution
        const pieCtx = document.getElementById('pieChart');
        if (pieCtx && !pieChartRef.current) {
            pieChartRef.current = new Chart(pieCtx, {
                type: 'pie',
                data: {
                    labels: taskTypeData.map(item => item.type),
                    datasets: [{
                        data: taskTypeData.map(item => item.total),
                        backgroundColor: COLORS,
                        borderColor: '#ffffff',
                        borderWidth: 2,
                        hoverOffset: 20
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: { font: { size: 10 } }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            titleColor: '#1e40af',
                            bodyColor: '#1e40af',
                            borderColor: '#bfdbfe',
                            borderWidth: 1
                        }
                    },
                    onClick: (event, elements) => {
                        if (elements.length > 0) {
                            const index = elements[0].index;
                            const type = taskTypeData[index].type;
                            setSelectedType(type === selectedType ? null : type);
                        }
                    }
                }
            });
        }

        // Bar Chart: Team Performance
        const teamCtx = document.getElementById('teamChart');
        if (teamCtx && !teamChartRef.current) {
            const userPerformanceData = uniqueUsers.map(userEmail => {
                const userTasks = currentUserTasks.filter(t => t.assignee === userEmail);
                return {
                    user: userEmail.split('@')[0],
                    completed: userTasks.filter(t => t.status === "Completed").length,
                    pending: userTasks.filter(t => t.status === "Pending").length
                };
            });

            teamChartRef.current = new Chart(teamCtx, {
                type: 'bar',
                data: {
                    labels: userPerformanceData.map(item => item.user),
                    datasets: [
                        {
                            label: 'Completed',
                            data: userPerformanceData.map(item => item.completed),
                            backgroundColor: 'rgba(34, 197, 94, 0.8)',
                            borderColor: 'rgba(34, 197, 94, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Pending',
                            data: userPerformanceData.map(item => item.pending),
                            backgroundColor: 'rgba(249, 115, 22, 0.8)',
                            borderColor: 'rgba(249, 115, 22, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: { font: { size: 10 } }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            titleColor: '#1e40af',
                            bodyColor: '#1e40af',
                            borderColor: '#bfdbfe',
                            borderWidth: 1
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            grid: { color: 'rgba(0, 0, 0, 0.05)' },
                            ticks: { font: { size: 10 } }
                        },
                        y: {
                            grid: { display: false },
                            ticks: { font: { size: 10 } }
                        }
                    }
                }
            });
        }

        // Radar Chart: Task Type Performance
        const radarCtx = document.getElementById('radarChart');
        if (radarCtx && !radarChartRef.current) {
            const radarData = ALL_TASK_TYPES.map(type => {
                const completed = currentUserTasks.filter(t => t.type === type && t.status === "Completed").length;
                const total = currentUserTasks.filter(t => t.type === type).length;
                return total > 0 ? ((completed / total) * 100).toFixed(1) : 0;
            });

            radarChartRef.current = new Chart(radarCtx, {
                type: 'radar',
                data: {
                    labels: ALL_TASK_TYPES,
                    datasets: [{
                        label: 'Completion Rate (%)',
                        data: radarData,
                        backgroundColor: 'rgba(124, 58, 237, 0.3)',
                        borderColor: 'rgba(124, 58, 237, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(124, 58, 237, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(124, 58, 237, 1)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: { font: { size: 10 } }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            titleColor: '#1e40af',
                            bodyColor: '#1e40af',
                            borderColor: '#bfdbfe',
                            borderWidth: 1
                        }
                    },
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            grid: { color: 'rgba(0, 0, 0, 0.1)' },
                            angleLines: { color: 'rgba(0, 0, 0, 0.1)' },
                            ticks: { font: { size: 10 } }
                        }
                    }
                }
            });
        }
    };

    const createUserChart = () => {
        if (modalChartRef.current) {
            modalChartRef.current.destroy();
        }
        const ctx = modalCanvasRef.current;
        if (ctx && selectedUser) {
            const userTasks = currentUserTasks.filter((t) => t.assignee === selectedUser);
            const userData = (selectedType ? [selectedType] : ALL_TASK_TYPES).map(type => ({
                type,
                completed: userTasks.filter(t => t.type === type && t.status === "Completed").length,
                pending: userTasks.filter(t => t.type === type && t.status === "Pending").length
            }));

            modalChartRef.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: userData.map(item => item.type),
                    datasets: [
                        {
                            label: 'Completed',
                            data: userData.map(item => item.completed),
                            backgroundColor: 'rgba(34, 197, 94, 0.8)',
                            borderColor: 'rgba(34, 197, 94, 1)',
                            borderWidth: 1,
                            borderRadius: 4
                        },
                        {
                            label: 'Pending',
                            data: userData.map(item => item.pending),
                            backgroundColor: 'rgba(249, 115, 22, 0.8)',
                            borderColor: 'rgba(249, 115, 22, 1)',
                            borderWidth: 1,
                            borderRadius: 4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: { font: { size: 12 } }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            titleColor: '#1e40af',
                            bodyColor: '#1e40af',
                            borderColor: '#bfdbfe',
                            borderWidth: 1
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(0, 0, 0, 0.05)' },
                            ticks: { font: { size: 12 } }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { font: { size: 12 } }
                        }
                    }
                }
            });
        }
    };

    useEffect(() => {
        if (showModal && selectedUser) {
            createUserChart();
        }
    }, [showModal, selectedUser, selectedType]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-blue-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-blue-600 text-sm">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-blue-50">
                <div className="text-center">
                    <p className="text-red-600 text-lg">{error}</p>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        onClick={() => {
                            setLoading(true);
                            setError(null);
                            dispatch(fetchTasksFromFirebase({ role: user.role, email: user.email }))
                                .then(() => setLoading(false))
                                .catch(() => {
                                    setError("Failed to fetch tasks. Please try again.");
                                    setLoading(false);
                                });
                        }}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard-wrapper">
                <div className="dashboard-header">
                    <div className="header-title">
                        <h1>Task Analytics Dashboard</h1>
                        <p>Real-time insights into task management and team performance</p>
                    </div>
                    <div className="user-select-container">
                        <select
                            className="user-select"
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            aria-label="Select user to view performance"
                        >
                            <option value="" disabled>Select a user</option>
                            {uniqueUsers.map((userEmail) => (
                                <option key={userEmail} value={userEmail}>
                                    {userEmail}
                                </option>
                            ))}
                        </select>
                        <button
                            className="view-button"
                            onClick={() => setShowModal(true)}
                            disabled={!selectedUser}
                            aria-label="View selected user's performance chart"
                        >
                            View
                        </button>
                    </div>
                </div>

                <div className="kpi-grid">
                    <KPICard title="Total Tasks" value={totalTasks} icon={<AlertCircle className="icon" />} color="bg-blue" trend={totalTasksTrend} />
                    <KPICard title="Completed" value={completedTasks} icon={<CheckCircle className="icon" />} color="bg-green" trend={completedTasksTrend} />
                    <KPICard title="Pending" value={pendingTasks} icon={<Clock className="icon" />} color="bg-amber" trend={pendingTasksTrend} />
                    <KPICard title="Completion Rate" value={`${completionRate}%`} icon={<TrendingUp className="icon" />} color="bg-purple" trend={completionRateTrend} />
                </div>

                <div className="chart-grid">
                    <div className="chart-card">
                        <h3>Task Distribution by Type</h3>
                        <div className="chart-wrapper">
                            <canvas id="barChart"></canvas>
                        </div>
                    </div>
                    <div className="chart-card">
                        <h3>Task Volume Distribution</h3>
                        <div className="chart-wrapper">
                            <canvas id="pieChart"></canvas>
                        </div>
                    </div>
                </div>

                <div className="chart-grid">
                    <div className="chart-card">
                        <h3>Team Performance</h3>
                        <div className="chart-wrapper">
                            <canvas id="teamChart"></canvas>
                        </div>
                    </div>
                    <div className="chart-card">
                        <h3>Task Type Performance</h3>
                        <div className="chart-wrapper">
                            <canvas id="radarChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && selectedUser && (
                <div className="modal-overlay">
                    <div className="modal">
                        <button
                            className="modal-close"
                            onClick={() => {
                                setShowModal(false);
                                if (modalChartRef.current) {
                                    modalChartRef.current.destroy();
                                    modalChartRef.current = null;
                                }
                            }}
                            aria-label="Close performance chart modal"
                        >
                            <svg className="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h3 className="modal-title">
                            Individual Performance: <span className="user-highlight">{selectedUser}</span>
                        </h3>
                        <div className="modal-info">
                            <div><Users className="info-icon" /> <span>{currentUserTasks.filter((t) => t.assignee === selectedUser).length} tasks</span></div>
                            <div><CheckCircle className="info-icon completed" /> <span>{currentUserTasks.filter((t) => t.assignee === selectedUser && t.status === "Completed").length} completed</span></div>
                        </div>
                        <div className="modal-chart">
                            <canvas ref={modalCanvasRef}></canvas>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default Dashboard;