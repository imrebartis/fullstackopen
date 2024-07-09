import { useQuery } from "@tanstack/react-query";
import { getAll } from "./services/anecdotes";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import Loading from "./components/Loading";
import Error from "./components/Error";

const useAnecdotes = () => {
  return useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAll,
    retry: 1,
  });
};

const App = () => {
  const { data: anecdotes, isLoading, isError } = useAnecdotes();

  const handleVote = (anecdote) => {
    console.log("vote", anecdote.id);
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <Error message="Anecdote service not available due to problems with the server." />
    );

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <AnecdoteForm />
      {anecdotes && anecdotes.length > 0 ? (
        anecdotes.map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
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
