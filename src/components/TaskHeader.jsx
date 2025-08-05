import { IoFilterSharp, IoClose } from "react-icons/io5";

const TaskHeader = ({
    title,
    toggle,
    setToggle,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
}) => (
    <div className="mb-8">
        <h1 className="text-3xl font-bold text-center text-indigo-600 my-6">
            {title}
        </h1>

        <div className="flex justify-between items-center bg-white p-3 w-full mb-4">
            <button
                onClick={() => setToggle(!toggle)}
                className="p-2 bg-indigo-500 hover:bg-indigo-600 transition-colors rounded-xl"
            >
                {toggle ? (
                    <IoClose className="text-xl text-white" />
                ) : (
                    <IoFilterSharp className="text-xl text-white" />
                )}
            </button>
            <span className="text-indigo-600 font-semibold text-lg">Filter Tasks</span>
        </div>


        {toggle && (
            <div className="my-6 mx-4 ">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 flex-wrap">
                    {/* Filter Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <span className="text-indigo-600 font-semibold">Date Range:</span>
                        <input
                            type="date"
                            value={startDate ? startDate.toISOString().split("T")[0] : ""}
                            onChange={(e) => setStartDate(new Date(e.target.value))}
                            className="bg-white px-4 py-2 rounded-xl border border-gray-300 shadow-sm"
                        />
                        <input
                            type="date"
                            value={endDate ? endDate.toISOString().split("T")[0] : ""}
                            onChange={(e) => setEndDate(new Date(e.target.value))}
                            className="bg-white px-4 py-2 rounded-xl border border-gray-300 shadow-sm"
                        />
                    </div>

                    {/* Sort Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <span className="text-indigo-600 font-semibold">Sort By:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-white px-4 py-2 rounded-xl border border-gray-300 shadow-sm"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                        </select>

                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="bg-white px-4 py-2 rounded-xl border border-gray-300 shadow-sm"
                        >
                            <option value="All">All Priority</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                </div>
            </div>
        )}

    </div>
);

export default TaskHeader;
