import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

const AddTask = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignor: "",
    startDate: new Date(),
    endDate: null,
    status: "Pending",
    assignee: "",
    priority: "Low",
    type: "",
    remarks: [],
    lastUpdatedOn: "",
    completedDate: "",
  });

  const [userEmails, setUserEmails] = useState([]);
  const [installationType, setInstallationType] = useState(""); // <-- NEW

  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const emails = usersSnapshot.docs.map((doc) => doc.data().email);
        setUserEmails(emails);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Reset installation type when changing task type
    if (name === "type" && value !== "Installation") {
      setInstallationType("");
    }
  };

  const handleStartDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      setFormData({ ...formData, startDate: date });
    }
  };

  const handleEndDateChange = (date) => {
    setFormData({ ...formData, endDate: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      title,
      description,
      startDate,
      endDate,
      status,
      assignee,
      priority,
      type,
    } = formData;

    if (
      !title ||
      !description ||
      !startDate ||
      !status ||
      !assignee ||
      !priority ||
      !type
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const serializableFormData = {
      ...formData,
      startDate: startDate.toISOString(),
      endDate: endDate ? endDate.toISOString() : null,
      remarks: [],
      completedDate: "",
      assignor: storedUser.email,
    };

    try {
      // 1. Create the main task
      await addDoc(collection(db, "tasks"), serializableFormData);

      // 2. If Installation + New Installation → also create Security Briefing
      if (type === "Installation" && installationType === "new") {
        const securityBriefingTask = {
          ...serializableFormData,
          type: "Security Briefing",
          title: "Security Briefing - " + title,
          description: "Auto-generated security briefing task",
          assignee: "areebops@gotrack.ae",
        };
        await addDoc(collection(db, "tasks"), securityBriefingTask);
      }

      alert("Task(s) added successfully!");
      setFormData({
        title: "",
        description: "",
        assignor: "",
        startDate: new Date(),
        endDate: null,
        status: "Pending",
        assignee: "",
        priority: "Low",
        type: "",
        remarks: [],
        lastUpdatedOn: "",
        completedDate: "",
      });
      setInstallationType("");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to add task. " + error.message);
    }
  };

  return (
    <div className="w-[70%] mx-auto">
      <h1 className="text-3xl font-bold mt-4 mb-4 text-center">Add New Task</h1>
      <div className="grid place-items-center">
        <form className="w-full max-w-lg" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-6">
            <label className="block text-gray-700 text-xs font-bold mb-2">
              Client Name
            </label>
            <input
              type="text"
              name="title"
              placeholder="Task Title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-200 border focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-gray-700 text-xs font-bold mb-2">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Task Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-200 border focus:outline-none"
            />
          </div>

          {/* Start and End Dates */}
          <div className="flex gap-4 mb-6">
            <div className="w-1/2">
              <label className="block text-gray-700 text-xs font-bold mb-2">
                Start Date
              </label>
              <DatePicker
                selected={formData.startDate}
                onChange={handleStartDateChange}
                dateFormat="dd/MM/yyyy"
                className="w-full p-3 rounded bg-gray-200 border focus:outline-none"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 text-xs font-bold mb-2">
                Due Date
              </label>
              <DatePicker
                selected={formData.endDate}
                onChange={handleEndDateChange}
                dateFormat="dd/MM/yyyy"
                className="w-full p-3 rounded bg-gray-200 border focus:outline-none"
              />
            </div>
          </div>

          {/* Status and Priority */}
          <div className="flex gap-4 mb-6">
            <div className="w-1/2">
              <label className="block text-gray-700 text-xs font-bold mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-200 border focus:outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="InProgress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 text-xs font-bold mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-200 border focus:outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Task Type */}
          <div className="mb-6">
            <label className="block text-gray-700 text-xs font-bold mb-2">
              Task Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-200 border focus:outline-none"
            >
              <option value="">Select Type</option>
              <option value="Removal">Removal</option>
              <option value="Installation">Installation</option>
              <option value="Health CheckUp">Health CheckUp</option>
              <option value="Complaint">Complaint</option>
              <option value="Security Briefing">Security Briefing</option>
            </select>
          </div>

          {/* Installation Checkboxes */}
          {formData.type === "Installation" && (
            <div className="mb-6">
              <label className="block text-gray-700 text-xs font-bold mb-2">
                Client Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="installationType"
                    value="existing"
                    checked={installationType === "existing"}
                    onChange={(e) => setInstallationType(e.target.value)}
                  />
                  Existing Client
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="installationType"
                    value="new"
                    checked={installationType === "new"}
                    onChange={(e) => setInstallationType(e.target.value)}
                  />
                  New Client
                </label>
              </div>
            </div>
          )}

          {/* Assignee Dropdown */}
          <div className="mb-6">
            <label className="block text-gray-700 text-xs font-bold mb-2">
              Assignee
            </label>
            <select
              name="assignee"
              value={formData.assignee}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-200 border focus:outline-none"
            >
              <option value="">Select Assignee</option>
              {userEmails.map((email, idx) => (
                <option key={idx} value={email}>
                  {email}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-500 text-white font-bold rounded hover:bg-indigo-400 transition"
          >
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
