// import PropTypes from 'prop-types';
// import { useDispatch } from 'react-redux';
// import { toggleTaskCompleted, removeTask, updateTask } from '../store/taskSlice';
// import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
// import { db } from '../firebase';  // your firebase config

// const Task = ({
//     id,
//     title,
//     completed,
//     description,
//     startDate,
//     endDate,
//     status,
//     assignee,
//     priority
// }) => {
//     const dispatch = useDispatch();

//     const updateFirestoreTask = async (updates) => {
//         try {
//             const taskDocRef = doc(db, 'tasks', id);
//             await updateDoc(taskDocRef, updates);
//         } catch (error) {
//             console.error("Error updating task in Firestore:", error);
//             alert("Failed to update task. Please try again.");
//         }
//     };

//     const handleToggleCompleted = async () => {
//         // Toggle completed status
//         const newCompleted = !completed;
//         const newStatus = newCompleted ? 'Completed' : 'Pending';

//         await updateFirestoreTask({ completed: newCompleted, status: newStatus });
//         dispatch(toggleTaskCompleted(id));
//     };

//     const handleRemoveTask = async () => {
//         try {
//             const taskDocRef = doc(db, 'tasks', id);
//             await deleteDoc(taskDocRef);
//             dispatch(removeTask(id));
//         } catch (error) {
//             console.error("Error removing task from Firestore:", error);
//             alert("Failed to remove task. Please try again.");
//         }
//     };

//     const handleUpdateTask = async (field, value) => {
//         // For completed status change, handleToggleCompleted should be used instead
//         if (field === 'completed') return;

//         await updateFirestoreTask({ [field]: value });
//         dispatch(updateTask({ id, [field]: value }));
//     };

//     return (
//         <li className={`task ${completed ? 'completed' : ''}`}>
//             <input
//                 type="checkbox"
//                 checked={completed}
//                 onChange={handleToggleCompleted}
//             />
//             <span>{title}</span>
//             <p>{description}</p>
//             <span className='text-rose-400'>Start Date: {startDate.slice(0, 10)}</span>
//             <span>End Date: {endDate ? endDate.slice(0, 10) : '---'}</span>
//             <select value={status} onChange={e => handleUpdateTask('status', e.target.value)}>
//                 <option value="Pending">Pending</option>
//                 <option value="In Progress">In Progress</option>
//                 <option value="Completed">Completed</option>
//                 <option value="Deployed">Deployed</option>
//                 <option value="Deferred">Deferred</option>
//             </select>
//             <input
//                 type="text"
//                 value={assignee}
//                 onChange={e => handleUpdateTask('assignee', e.target.value)}
//                 placeholder="Assignee"
//             />
//             <select value={priority} onChange={e => handleUpdateTask('priority', e.target.value)}>
//                 <option value="">Priority</option>
//                 <option value="P0">P0</option>
//                 <option value="P1">P1</option>
//                 <option value="P2">P2</option>
//             </select>
//             <button onClick={handleRemoveTask}>Remove</button>
//         </li>
//     );
// };

// Task.propTypes = {
//     id: PropTypes.any.isRequired,
//     title: PropTypes.string.isRequired,
//     completed: PropTypes.bool.isRequired,
//     description: PropTypes.string.isRequired,
//     startDate: PropTypes.string.isRequired,
//     endDate: PropTypes.string,
//     status: PropTypes.string.isRequired,
//     assignee: PropTypes.string.isRequired,
//     priority: PropTypes.string.isRequired,
// };

// export default Task;
