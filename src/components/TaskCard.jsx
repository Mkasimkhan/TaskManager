
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { toggleTaskCompleted } from '../store/taskSlice';
import { useState, useEffect } from "react";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

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
        // Trigger animation after mount
        setFadeIn(true);
    }, []);

    const getDate = (dateString) => {
        const dateObject = new Date(dateString);
        return dateObject.toLocaleDateString();
    };

    const startDatee = getDate(startDate);
    const endDatee = getDate(endDate);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "completed":
                return "bg-green-200 text-green-800";
            case "in progress":
                return "bg-blue-200 text-blue-800";
            case "pending":
                return "bg-yellow-200 text-yellow-800";
            default:
                return "bg-white text-black";
        }
    };

    const handleToggleCompleted = async () => {
        try {
            const taskDocRef = doc(db, 'tasks', id);
            const newStatus = complete ? 'pending' : 'completed';
            await updateDoc(taskDocRef, { status: newStatus });
            setComplete(!complete);
            dispatch(toggleTaskCompleted(id));
        } catch (error) {
            console.error("Failed to update task status:", error);
            alert("Failed to update task. Please try again.");
        }
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
            {/* <div
                className={`relative bg-clip-border mt-6 ml-4 mr-4 rounded-lg ${getStatusColor(
                    complete ? 'completed' : status
                )} shadow-md h-45 transition-colors duration-300 ease-in-out`}
            >
                <h1 className="anton-regular text-end pt-2 pr-3 text-sm">{priority}</h1>
                <h1 className="font-bold text-center text-xl py-4 mb-5 ubuntu-bold">{title}</h1>
            </div> */}

            <div
                className={`relative bg-clip-border mt-6 ml-4 mr-4 rounded-lg ${getStatusColor(
                    complete ? 'completed' : status
                )} shadow-md h-45 transition-colors duration-300 ease-in-out`}
            >
                {/* Container for type and priority */}
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
                        <p className="font-light">{startDatee}</p>
                    </div>
                    <div className="flex flex-col">
                        <p>End Date</p>
                        <p className="font-light">{endDatee}</p>
                    </div>
                </div>
            </div>

            <div className="footer p-3 flex items-center justify-between">
                <p className="font-light text-xs text-black">{assignee || 'Puskar Roy'}</p>
                <button
                    onClick={handleToggleCompleted}
                    type="button"
                    className={`flex items-center justify-center gap-2 text-black select-none focus:outline-none shadow-md uppercase font-bold text-xs py-2 px-6 rounded-lg transition-all duration-300 ${complete
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
    endDate: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    assignee: PropTypes.string,
    priority: PropTypes.string,
};

export default TaskCard;
