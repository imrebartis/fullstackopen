import { createSlice } from "@reduxjs/toolkit";

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
    createAnecdote: (state, action) => {
      state.push(action.payload);
    },
    setAnecdotes: (state, action) => {
      return action.payload;
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
  },
});

export const { vote, createAnecdote, setAnecdotes, appendAnecdote } = anecdoteReducer.actions;
export default anecdoteReducer.reducer;
