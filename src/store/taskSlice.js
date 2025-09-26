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


export const fetchTasksFromFirebase = createAsyncThunk(
  "tasks/fetchFromFirebase",
  async ({ role, email, type }, thunkAPI) => {
    try {
      const tasksRef = collection(db, "tasks");
      let q;
      if (type === "Created") {
        q = query(tasksRef, where("assignor", "==", email));
      } else if (role === "admin") {
        q = tasksRef; 
      } else {
        q = query(tasksRef, where("assignee", "==", email));
      }
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

export const deleteTaskFromFirebase = createAsyncThunk(
  "tasks/deleteFromFirebase",
  async (firebaseId, thunkAPI) => {
    try {
      await deleteDoc(doc(db, "tasks", firebaseId));
      return firebaseId; 
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

    toggleTaskCompleted: (state, action) => {
      const { firebaseId, newStatus } = action.payload;

      const taskIndex = state.findIndex((task) => task.firebaseId === firebaseId);
      if (taskIndex !== -1) {
        state[taskIndex].status = newStatus;
        state[taskIndex].endDate =
          newStatus === "Completed" ? new Date().toISOString() : null;
      }

      updateDoc(doc(db, "tasks", firebaseId), {
        status: newStatus,
        endDate: newStatus === "Completed" ? new Date().toISOString() : null,
      }).catch((error) =>
        console.error("Error updating task status:", error)
      );
    },

    updateTask: (state, action) => {
      const { firebaseId, ...updatedFields } = action.payload;

      const index = state.findIndex((task) => task.firebaseId === firebaseId);
      if (index !== -1) {
        state[index] = {
          ...state[index],
          ...updatedFields,
        };
      }

      updateDoc(doc(db, "tasks", firebaseId), updatedFields)
        .then(() => console.log("Task updated"))
        .catch((error) => console.error("Error updating task:", error));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksFromFirebase.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(deleteTaskFromFirebase.fulfilled, (state, action) => {
        return state.filter((task) => task.firebaseId !== action.payload);
      });
  },
});

export const { addTask, toggleTaskCompleted, updateTask } = taskSlice.actions;

export default taskSlice.reducer;

export const selectAllTasks = (state) => state.tasks;
