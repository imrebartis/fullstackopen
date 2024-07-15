import { Link } from "react-router-dom";
import Notification from "./Notification";

const AnecdoteList = ({ anecdotes, notification }) => {
  return (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map((anecdote) => (
        <li key={anecdote.id}>
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      ))}
    </ul>
    {notification && <Notification message={notification} />}
  </div>
  );
}

export default AnecdoteList;
