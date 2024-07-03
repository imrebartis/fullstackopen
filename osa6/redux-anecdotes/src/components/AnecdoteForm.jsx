import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";
import {
  clearNotification,
  setNotification,
} from "../reducers/notificationReducer";
import anecdoteService from "../services/anecdotes";

const AnecdoteForm = () => {
  const [anecdote, setAnecdote] = useState("");
  const dispatch = useDispatch();

  const addAnecdote = async (event) => {
    event.preventDefault();
    if (!anecdote.trim()) return;
    const newAnecdote = await anecdoteService.createNew(anecdote);
    dispatch(createAnecdote(newAnecdote));
    dispatch(setNotification(`the anecdote "${anecdote}" has been created`));
    setAnecdote("");
    setTimeout(() => {
      dispatch(clearNotification(""));
    }, 5000);
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input
            value={anecdote}
            onChange={(e) => setAnecdote(e.target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;
