import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { vote, createAnecdote } from "./reducers/anecdoteReducer";

const App = () => {
  const anecdotes = useSelector((state) => state);
  const dispatch = useDispatch();
  const [anecdote, setAnecdote] = useState("");

  const addAnecdote = (event) => {
    event.preventDefault();
    if (!anecdote.trim()) return;
    dispatch(createAnecdote(anecdote));
    setAnecdote("");
  };

  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes);

  return (
    <div>
      <h2>Anecdotes</h2>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => dispatch(vote(anecdote.id))}>vote</button>
          </div>
        </div>
      ))}
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
    </div>
  );
};

export default App;
