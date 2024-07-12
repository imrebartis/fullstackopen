import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createAnecdote } from "../services/anecdotes";
import { useNotificationDispatch } from "../NotificationContext";

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const dispatch = useNotificationDispatch();
  const newAnecdoteMutation = useMutation({
    mutationFn: (newAnecdote) => createAnecdote(newAnecdote),
    onSuccess: (newAnecdote) => {
      queryClient.setQueryData(["anecdotes"], (oldAnecdotes) => [
        ...oldAnecdotes,
        newAnecdote,
      ]);
      dispatch({
        type: "SET_NOTIFICATION",
        payload: `the anecdote "${newAnecdote.content}" has been created`,
      });
    },
    onError: (error) => {
      if (error.response && error.response.status === 400) {
        dispatch({
          type: "SET_NOTIFICATION",
          payload: error.response.data.error,
        });
      }
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    newAnecdoteMutation.mutate({ content });
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
