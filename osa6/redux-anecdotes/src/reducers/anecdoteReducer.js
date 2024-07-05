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
    vote: (state, action) => {
      const id = action.payload;
      console.log("id:", id);
      console.log("state:", JSON.parse(JSON.stringify(state)));
      return state.map((anecdote) =>
        anecdote.id === id
          ? { ...anecdote, votes: anecdote.votes + 1 }
          : anecdote
      );
    },
    setAnecdotes: (state, action) => {
      return action.payload;
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
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

export const { vote, setAnecdotes, appendAnecdote } = anecdoteReducer.actions;
export default anecdoteReducer.reducer;
