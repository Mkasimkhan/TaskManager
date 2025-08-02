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
      const tasksRef = collection(db, "tasks");
      const q = role === "admin" ? tasksRef : query(tasksRef, where("assignee", "==", email));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        firebaseId: doc.id,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: [],
  reducers: {
    addTask: (state, action) => {
      const newTask = action.payload;
      addDoc(collection(db, "tasks"), newTask)
        .then((docRef) => {
          console.log("Task added with ID:", docRef.id);
        })
        .catch((error) => console.error("Error adding task:", error));
    },

    removeTask: (state, action) => {
      const firebaseId = action.payload;
      deleteDoc(doc(db, "tasks", firebaseId))
        .then(() => console.log("Task deleted"))
        .catch((error) => console.error("Error deleting task:", error));
    },

    toggleTaskCompleted: (state, action) => {
      const { firebaseId, newStatus } = action.payload;

      const taskIndex = state.findIndex(task => task.firebaseId === firebaseId);
      if (taskIndex !== -1) {
        state[taskIndex].status = newStatus;
        state[taskIndex].endDate = newStatus === "Completed" ? new Date().toISOString() : null;
      }

      updateDoc(doc(db, "tasks", firebaseId), {
        status: newStatus,
        endDate: newStatus === "Completed" ? new Date().toISOString() : null,
      }).catch((error) => console.error("Error updating task status:", error));
    },

    updateTask: (state, action) => {
      const { firebaseId, ...updatedFields } = action.payload;
      updateDoc(doc(db, "tasks", firebaseId), updatedFields)
        .then(() => console.log("Task updated"))
        .catch((error) => console.error("Error updating task:", error));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTasksFromFirebase.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const {
  addTask,
  removeTask,
  toggleTaskCompleted,
  updateTask,
} = taskSlice.actions;

export default taskSlice.reducer;

export const selectAllTasks = (state) => state.tasks;
