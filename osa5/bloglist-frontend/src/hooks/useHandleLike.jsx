import { useQueryClient, useMutation } from '@tanstack/react-query'
import { updateBlog } from '../services/blogs'
import { useNotificationDispatch } from '../NotificationContext'

const useHandleLike = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const mutation = useMutation({
    mutationFn: updateBlog,
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(['blogs'], (oldBlogs = []) =>
        oldBlogs.map((blog) =>
          blog.id !== updatedBlog.id ? blog : updatedBlog
        )
      )
      dispatch({
        type: 'SET_SUCCESS_NOTIFICATION',
        payload: `you voted "${updatedBlog.title}"`
      })
      queryClient.invalidateQueries(['blogs'])
    },
    onError: (error) => {
      console.error(error)
      dispatch({
        type: 'SET_ERROR_NOTIFICATION',
        payload: 'Error updating blog'
      })
    }
  })

  const handleLike = (blog) => {
    console.log('like', blog.id)
    const updatedBlog = { ...blog, likes: (blog.likes || 0) + 1 }
    mutation.mutate(updatedBlog)
  }

  return handleLike
}

export default useHandleLike
