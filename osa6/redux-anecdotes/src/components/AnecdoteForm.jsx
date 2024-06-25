import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";

const AnecdoteForm = () => {
  const [anecdote, setAnecdote] = useState("");
  const dispatch = useDispatch();

  const addAnecdote = (event) => {
    event.preventDefault();
    if (!anecdote.trim()) return;
    dispatch(createAnecdote(anecdote));
    setAnecdote("");
  };

  return (
    <form onSubmit={addAnecdote}>
      <div>
        <input value={anecdote} onChange={(e) => setAnecdote(e.target.value)} />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default AnecdoteForm;
