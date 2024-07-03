import { createSlice } from "@reduxjs/toolkit";

export const notificationReducer = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    setErrorNotification: (state, action) => action.payload,
    clearErrorNotification: (state, action) => action.payload,
    setNotification: (state, action) => action.payload,
    clearNotification: (state, action) => action.payload,
  },
});

export const {
  setErrorNotification,
  clearErrorNotification,
  setNotification,
  clearNotification,
} = notificationReducer.actions;
export default notificationReducer.reducer;
