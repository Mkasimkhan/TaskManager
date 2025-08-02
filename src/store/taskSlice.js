import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query, 
  where,
} from "firebase/firestore";
import { db } from "../firebase";

// Async thunk to fetch tasks from Firestore
export const fetchTasksFromFirebase = createAsyncThunk(
  "tasks/fetchFromFirebase",
  async ({ role, email }, thunkAPI) => {
    try {
      let q;
      const tasksRef = collection(db, "tasks");

      if (role === "admin") {
        q = tasksRef; // fetch all
      } else {
        q = query(tasksRef, where("assignee", "==", email));
      }

      const snapshot = await getDocs(q);
      const tasks = snapshot.docs.map((doc) => ({
        ...doc.data(),
        firebaseId: doc.id,
      }));
      return tasks;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = [];

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // Add task to Firestore
    addTask: (state, action) => {
      const newTask = {
        title: action.payload.title,
        description: action.payload.description,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
        status: action.payload.status || "Pending",
        assignee: action.payload.assignee || "",
        priority: action.payload.priority || "",
      };

      // Push to Firestore
      addDoc(collection(db, "tasks"), newTask)
        .then((docRef) => {
          console.log("Task added with ID:", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding task:", error);
        });
    },

    // Remove task from Firestore
    removeTask: (state, action) => {
      const firebaseId = action.payload;
      deleteDoc(doc(db, "tasks", firebaseId))
        .then(() => {
          console.log("Task deleted");
        })
        .catch((error) => {
          console.error("Error deleting task:", error);
        });
    },

    // Toggle status between Completed and Pending
    toggleTaskCompleted: (state, action) => {
      const { firebaseId, currentStatus } = action.payload;
      const updatedStatus = currentStatus !== "Completed" ? "Completed" : "Pending";
      const updatedEndDate =
        updatedStatus === "Completed" ? new Date().toISOString() : null;

      updateDoc(doc(db, "tasks", firebaseId), {
        status: updatedStatus,
        endDate: updatedEndDate,
      })
        .then(() => {
          console.log("Task status updated");
        })
        .catch((error) => {
          console.error("Error updating task status:", error);
        });
    },

    // Update task fields in Firestore
    updateTask: (state, action) => {
      const { firebaseId, ...updatedFields } = action.payload;

      updateDoc(doc(db, "tasks", firebaseId), updatedFields)
        .then(() => {
          console.log("Task updated");
        })
        .catch((error) => {
          console.error("Error updating task:", error);
        });
    },
  },

  // Update Redux state with fetched tasks
  extraReducers: (builder) => {
    builder.addCase(fetchTasksFromFirebase.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

// Exports
export const {
  addTask,
  removeTask,
  toggleTaskCompleted,
  updateTask,
} = taskSlice.actions;

export default taskSlice.reducer;

export const selectAllTasks = (state) => state.tasks;
