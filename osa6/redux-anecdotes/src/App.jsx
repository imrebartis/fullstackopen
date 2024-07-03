import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import Filter from "./components/Filter";
import Notification from "./components/Notification";
import anecdoteService from "./services/anecdotes";
import { setAnecdotes } from "./reducers/anecdoteReducer";
import {
  setErrorNotification,
  clearErrorNotification,
} from "./reducers/notificationReducer";

const App = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification);

  useEffect(() => {
    const fetchAnecdotes = async () => {
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

    fetchAnecdotes();
  }, []);

  return (
    <div>
      <h2>Anecdotes</h2>
      {notification && <Notification />}
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  );
};

export default App;
