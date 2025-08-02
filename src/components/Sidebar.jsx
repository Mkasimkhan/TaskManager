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
} from "react-icons/md";
import { GrInProgress } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Sidebar = () => {
    const [userRole, setUserRole] = useState(null);
    const [userEmail, setUserEmail] = useState("");
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
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <div className="bg-indigo-500 min-h-[100vh] sm:min-h-screen w-[5rem] sm:w-[19rem] flex flex-col justify-between roboto-regular">
            {/* Top section */}
            <div>
                <div className="flex items-center gap-2 justify-center h-16 text-white text-2xl font-bold mt-6">
                    <GrTask />
                    <span className="sm:block hidden">Task Manager</span>
                </div>

                <nav className="flex gap-10 justify-start">
                    <ul className="py-6 flex flex-col justify-start">
                        <Link
                            to="/app/allTasks"
                            className="px-6 py-3 font-semibold text-lg text-gray-300 hover:text-gray-700 cursor-pointer flex justify-start items-center gap-2"
                        >
                            <MdDashboard className="text-2xl" />
                            <span className="sm:block hidden">Dashboard</span>
                        </Link>

                        <Link
                            to="/app/removalTask"
                            className="px-6 py-3 font-semibold text-lg text-gray-300 hover:text-gray-700 cursor-pointer flex justify-start items-center gap-2"
                        >
                            <MdOutlineTaskAlt className="text-2xl" />
                            <span className="sm:block hidden">Removal Tasks</span>
                        </Link>

                        <Link
                            to="/app/installationTask"
                            className="px-6 py-3 font-semibold text-lg text-gray-300 hover:text-gray-700 cursor-pointer flex justify-start items-center gap-2"
                        >
                            <MdPendingActions className="text-2xl" />
                            <span className="sm:block hidden">Installation Tasks</span>
                        </Link>

                        <Link
                            to="/app/healthcheckupTask"
                            className="px-6 py-3 font-semibold text-lg text-gray-300 hover:text-gray-700 cursor-pointer flex justify-start items-center gap-2"
                        >
                            <GrInProgress className="text-2xl" />
                            <span className="sm:block hidden">Health Check Up Task</span>
                        </Link>

                        <Link
                            to="/app/complaintTask"
                            className="px-6 py-3 font-semibold text-lg text-gray-300 hover:text-gray-700 cursor-pointer flex justify-start items-center gap-2"
                        >
                            <MdCloudDone className="text-2xl" />
                            <span className="sm:block hidden">Complaint Tasks</span>
                        </Link>

                        <Link
                            to="/app/securitybriefingTask"
                            className="px-6 py-3 font-semibold text-lg text-gray-300 hover:text-gray-700 cursor-pointer flex justify-start items-center gap-2"
                        >
                            <MdCloudDone className="text-2xl" />
                            <span className="sm:block hidden">Security Briefing Tasks</span>
                        </Link>

                        {userRole === "admin" && (
                            <Link
                                to="/app/addTask"
                                className="px-6 py-3 font-semibold text-lg text-gray-300 hover:text-gray-700 cursor-pointer flex justify-start items-center gap-2"
                            >
                                <MdAddTask className="text-2xl" />
                                <span className="sm:block hidden">Add New Tasks</span>
                            </Link>
                        )}


                        <Link
                            to="/app/statsTask"
                            className="px-6 py-3 font-semibold text-lg text-gray-300 hover:text-gray-700 cursor-pointer flex justify-start items-center gap-2"
                        >
                            <MdQueryStats className="text-2xl" />
                            <span className="sm:block hidden">Task Stats</span>
                        </Link>

                        {userRole === "admin" && (
                            <Link
                                to="/app/user-management"
                                className="px-6 py-3 font-semibold text-lg text-gray-300 hover:text-gray-700 cursor-pointer flex justify-start items-center gap-2"
                            >
                                <MdPeople className="text-2xl" />
                                <span className="sm:block hidden">User Management</span>
                            </Link>
                        )}
                    </ul>
                </nav>
            </div>

            {/* Bottom section: email + logout */}
            <div className="flex flex-col px-6 mb-6 text-white text-sm">
                {userEmail && (
                    <div
                        className="cursor-default py-2 font-semibold text-lg text-gray-300 hover:text-gray-700 flex justify-start items-center gap-2"
                    >
                        <MdEmail className="text-2xl" />
                        <span className="sm:block hidden">{userEmail}</span>
                    </div>
                )}
                <div
                    onClick={handleLogout}
                    className="cursor-pointer py-2 font-semibold text-lg text-gray-300 hover:text-gray-700 flex justify-start items-center gap-2"
                >
                    <MdOutlineAccessTimeFilled className="text-2xl" />
                    <span className="sm:block hidden">Logout</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
