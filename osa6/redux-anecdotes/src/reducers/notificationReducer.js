import { createSlice } from "@reduxjs/toolkit";

export const notificationReducer = createSlice({
  name: "notification",
  initialState: "this is a notification",
  reducers: {
    setNotification: (state, action) => action.payload,
  },
});

export const { setNotification } = notificationReducer.actions;
export default notificationReducer.reducer;
