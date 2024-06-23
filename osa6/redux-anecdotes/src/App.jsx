import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const App = () => {
  const anecdotes = useSelector((state) => state);
  const dispatch = useDispatch();
  const [anecdote, setAnecdote] = useState("");

  const generateId = () => Number((Math.random() * 1000000).toFixed(0));

  const vote = (id) => {
    console.log("vote", id);
    dispatch({
      type: "VOTE",
      payload: { id },
    });
  };

  const addAnecdote = (event) => {
    event.preventDefault();
    if (!anecdote.trim()) return;
    dispatch({
      type: "NEW_ANECDOTE",
      payload: {
        content: anecdote,
        id: generateId(),
        votes: 0,
      },
    });
    setAnecdote("");
  };

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
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
