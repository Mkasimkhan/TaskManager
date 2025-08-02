import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // adjust path if needed
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Card = ({ label, count, bg }) => {
    return (
        <Link to="/allTask">
            <div className="w-full h-32 bg-white p-5 shadow-md rounded-md flex items-center justify-between cursor-pointer">
                <div className="h-full flex flex-1 flex-col justify-between">
                    <p className="text-base text-gray-600">{label}</p>
                    <span className="text-2xl font-semibold">{count}</span>
                    <span className="text-sm text-gray-400">Live count</span>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${bg}`}>
                    {label.charAt(0)}
                </div>
            </div>
        </Link>
    );
};

Card.propTypes = {
    label: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    bg: PropTypes.string.isRequired,
};

const Dashboard = () => {
    const [taskStats, setTaskStats] = useState({
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
    });

    useEffect(() => {
        const fetchTasks = async () => {
            const querySnapshot = await getDocs(collection(db, "tasks"));
            const tasks = querySnapshot.docs.map((doc) => doc.data());

            const stats = {
                total: tasks.length,
                completed: tasks.filter((task) => task.status === "Completed").length,
                inProgress: tasks.filter((task) => task.status === "In Progress").length,
                pending: tasks.filter((task) => task.status === "Pending").length,
                deployed: tasks.filter((task) => task.status === "Deployed").length,
            };

            setTaskStats(stats);
        };

        fetchTasks();
    }, []);

    const stats = [
        { label: "TOTAL TASK", total: taskStats.total, bg: "bg-[#1d4ed8]" },
        { label: "COMPLETED TASK", total: taskStats.completed, bg: "bg-[#0f766e]" },
        { label: "TASK IN PROGRESS", total: taskStats.inProgress, bg: "bg-[#f59e0b]" },
        { label: "PENDING", total: taskStats.pending, bg: "bg-[#be185d]" },
    ];

    return (
        <div className="mx-auto w-[80%]">
            <div className="flex flex-col w-full justify-between">
                <h1 className="sm:text-2xl text-3xl font-bold my-8 text-center">Tasks</h1>
                <div className="h-full w-80% mx-auto py-4 px-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 place-item-center">
                        {stats.map(({ label, total, bg }, index) => (
                            <Card key={index} bg={bg} label={label} count={total} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
