import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useNotificationValue,
  useNotificationDispatch,
} from "./NotificationContext";
import { getAnecdotes, updateAnecdote } from "./services/anecdotes";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import Loading from "./components/Loading";
import Error from "./components/Error";

const useAnecdotes = () => {
  return useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

const updateAnecdoteMutation = (updatedAnecdote, queryClient) => {
  return queryClient.setQueryData(["anecdotes"], (oldAnecdotes) =>
    oldAnecdotes.map((anecdote) =>
      anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
    )
  );
};

const App = () => {
  const { data: anecdotes, isLoading, isError } = useAnecdotes();
  const queryClient = useQueryClient();
  const notification = useNotificationValue();
  const dispatch = useNotificationDispatch();

  const handleVote = async (anecdote) => {
    console.log("vote", anecdote.id);
    const updatedAnecdote = { ...anecdote, votes: (anecdote.votes || 0) + 1 };
    async function updateAnecdoteOnVote(updatedAnecdote) {
      await updateAnecdote(updatedAnecdote);
      updateAnecdoteMutation(updatedAnecdote, queryClient);
    }
    await updateAnecdoteOnVote(updatedAnecdote);
    dispatch({
      type: "SET_NOTIFICATION",
      payload: `you voted "${anecdote.content}"`,
    });
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <Error message="Anecdote service not available due to problems with the server." />
    );

  return (
    <div>
      <h3>Anecdote app</h3>
      {notification && <Notification message={notification.payload} />}
      <AnecdoteForm />
      {anecdotes && anecdotes.length > 0 ? (
        anecdotes.map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes || 0}
              <button onClick={() => handleVote(anecdote)}>vote</button>
            </div>
          </div>
        ))
      ) : (
        <div>No anecdotes available</div>
      )}
    </div>
  );
};

export default App;
