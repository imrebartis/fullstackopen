import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";
import {
  setErrorNotification,
  clearErrorNotification,
} from "./notificationReducer";

const initialState = [];

export const anecdoteReducer = createSlice({
  name: "anecdotes",
  initialState,
  reducers: {
    setAnecdotes: (state, action) => {
      return action.payload;
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    updateAnecdote: (state, action) => {
      const updatedAnecdote = action.payload;
      return state.map((anecdote) =>
        anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
      );
    },
  },
});

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    try {
      const anecdotes = await anecdoteService.getAll();
      dispatch(setAnecdotes(anecdotes));
      dispatch(clearErrorNotification(""));
    } catch (error) {
      console.error("Failed to fetch anecdotes:", error);
      dispatch(
        setErrorNotification(`Error fetching anecdotes: ${error.message}`)
      );
    }
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const vote = (id) => {
  return async (dispatch) => {
    try {
      const updatedAnecdote = await anecdoteService.updateVotes(id);
      dispatch(updateAnecdote(updatedAnecdote));
    } catch (error) {
      console.error("Failed to update votes for anecdote:", error);
      dispatch(setErrorNotification(`Error updating votes: ${error.message}`));
    }
  };
};

export const { setAnecdotes, appendAnecdote, updateAnecdote } =
  anecdoteReducer.actions;
export default anecdoteReducer.reducer;
