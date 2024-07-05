import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";
import {
  clearNotification,
  setNotification,
  setErrorNotification,
  clearErrorNotification,
} from "../reducers/notificationReducer";

const AnecdoteForm = () => {
  const [anecdote, setAnecdote] = useState("");
  const dispatch = useDispatch();

  const addAnecdote = async (event) => {
    event.preventDefault();
    if (!anecdote.trim()) {
      dispatch(setErrorNotification("Anecdote cannot be empty"));
      return;
    }

    try {
      dispatch(createAnecdote(anecdote));
      dispatch(setNotification(`the anecdote "${anecdote}" has been created`));
      setAnecdote("");
      dispatch(clearErrorNotification(""));
      setTimeout(() => {
        dispatch(clearNotification(""));
      }, 5000);
    } catch (error) {
      console.error("Failed to add anecdote:", error);
      dispatch(setErrorNotification(`Error adding anecdote: ${error.message}`));
    }
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input
            name="anecdote"
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
