import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { toggleTaskCompleted } from '../store/taskSlice';
import { useState, useEffect } from "react";

const TaskCard = ({
    id,
    title,
    description,
    startDate,
    endDate,
    status,
    assignee,
    priority,
    type,
}) => {
    const [complete, setComplete] = useState(status.toLowerCase() === 'completed');
    const [fadeIn, setFadeIn] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        setFadeIn(true);
    }, []);

    const getDate = (dateString) => new Date(dateString).toLocaleDateString();

    const startDateFormatted = getDate(startDate);
    const endDateFormatted = endDate ? getDate(endDate) : '-';

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "completed":
                return "bg-green-200 text-green-800";
            case "pending":
                return "bg-yellow-200 text-yellow-800";
            default:
                return "bg-white text-black";
        }
    };

    const handleToggleCompleted = () => {
        const newStatus = complete ? "Pending" : "Completed";
        dispatch(toggleTaskCompleted({ firebaseId: id, newStatus }));
        setComplete(!complete);
    };

    return (
        <div
            className={`
                transform transition-all duration-500 ease-in-out 
                ${fadeIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                hover:scale-105
                flex flex-col rounded-xl justify-center gap-4 bg-white 
                w-72 max-h-[370px] shadow-xl border
            `}
        >
            <div
                className={`relative bg-clip-border mt-6 ml-4 mr-4 rounded-lg ${getStatusColor(
                    complete ? 'completed' : status
                )} shadow-md h-45 transition-colors duration-300 ease-in-out`}
            >
                <div className="absolute top-2 left-3 right-3 flex justify-between px-2">
                    <h1 className="anton-regular text-sm">{type}</h1>
                    <h1 className="anton-regular text-sm">{priority}</h1>
                </div>

                <h1 className="font-bold text-center text-xl py-4 mb-5 mt-5 ubuntu-bold">{title}</h1>
            </div>

            <div className="border-0 p-2 text-center">
                <p className="poppins-light">{description}</p>
                <div className="flex justify-between mt-[5px] text-sm font-semibold py-2 px-4">
                    <div className="flex flex-col">
                        <p>Start Date</p>
                        <p className="font-light">{startDateFormatted}</p>
                    </div>
                    <div className="flex flex-col">
                        <p>End Date</p>
                        <p className="font-light">{endDateFormatted}</p>
                    </div>
                </div>
            </div>

            <div className="footer p-3 flex items-center justify-between">
                <p className="font-light text-xs text-black">{assignee || 'Unknown'}</p>
                <button
                    onClick={handleToggleCompleted}
                    type="button"
                    className={`flex items-center justify-center gap-2 select-none shadow-md uppercase font-bold text-xs py-2 px-6 rounded-lg transition-all duration-300 ${complete
                        ? 'bg-green-200 text-green-800'
                        : getStatusColor(status)
                        }`}
                >
                    {complete ? 'Completed' : status}
                </button>
            </div>
        </div>
    );
};

TaskCard.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string,
    status: PropTypes.string.isRequired,
    assignee: PropTypes.string,
    priority: PropTypes.string,
    type: PropTypes.string,
};

export default TaskCard;
