import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const generateId = () => Number((Math.random() * 1000000).toFixed(0));

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
      const newAnecdote = {
        content: action.payload,
        id: generateId(),
        votes: 0,
      };
      state.push(newAnecdote);
    },
    setAnecdotes: (state, action) => {
      return action.payload
    }
  },
});

export const { vote, createAnecdote, setAnecdotes } = anecdoteReducer.actions;
export default anecdoteReducer.reducer;
