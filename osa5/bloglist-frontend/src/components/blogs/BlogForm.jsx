import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Button, TextField } from '@mui/material'
import { useNotificationDispatch } from '../../NotificationContext'
import { createBlog } from '../../services/blogs'

const BlogForm = ({ visible, blogFormRef }) => {
  const { register, handleSubmit, reset } = useForm()
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  useEffect(() => {
    if (!visible) {
      reset()
    }
  }, [visible, reset])

  const newBlogMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: (newBlog) => {
      queryClient.setQueryData(['blogs'], (oldBlogs) => [...oldBlogs, newBlog])
      dispatch({
        type: 'SET_SUCCESS_NOTIFICATION',
        payload: `the blog "${newBlog.title}" has been created`
      })
      queryClient.invalidateQueries(['blogs'])
      reset()
    },
    onError: (error) => {
      if (error.response && error.response.status === 400) {
        dispatch({
          type: 'SET_ERROR_NOTIFICATION',
          payload: error.response.data.error
        })
      }
    }
  })

  const onCreate = (data) => {
    const { title, author, url } = data
    blogFormRef.current.toggleVisibility()

    if (!title && !url) {
      dispatch({
        type: 'SET_ERROR_NOTIFICATION',
        payload: 'Title and url are required'
      })
      return
    }

    if (!title) {
      dispatch({
        type: 'SET_ERROR_NOTIFICATION',
        payload: 'Title is required'
      })
      return
    }

    if (!url) {
      dispatch({
        type: 'SET_ERROR_NOTIFICATION',
        payload: 'Url is required'
      })
      return
    }

    newBlogMutation.mutate({
      title,
      author,
      url
    })
  }

  return (
    <form onSubmit={handleSubmit(onCreate)} style={{ marginBottom: '16px' }}>
      <h2>create new</h2>
      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}
      >
        <TextField
          label="Title"
          {...register('title')}
          type="text"
          style={{ marginLeft: '8px' }}
          data-testid="title"
          autoComplete="off"
        />
      </div>
      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}
      >
        <TextField
          label="Author"
          {...register('author')}
          type="text"
          style={{ marginLeft: '8px' }}
          data-testid="author"
          autoComplete="off"
        />
      </div>
      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}
      >
        <TextField
          label="Url"
          {...register('url')}
          type="text"
          style={{ marginLeft: '8px' }}
          data-testid="url"
          autoComplete="off"
        />
      </div>
      <Button
        variant="contained"
        color="primary"
        data-testid="create-button"
        type="submit"
      >
        create
      </Button>
    </form>
  )
}

export default BlogForm
