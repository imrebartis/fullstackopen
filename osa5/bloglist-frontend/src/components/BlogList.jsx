import { useRef } from 'react'
import PropTypes from 'prop-types'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { removeBlog } from '../services/blogs'
import { useNotificationDispatch } from '../NotificationContext'
import { getBlogs } from '../services/blogs'
import Togglable from './Togglable'
import Blog from './Blog'
import BlogForm from './BlogForm'
import Loading from './Loading'
import Error from './Error'
import useHandleLike from '../hooks/useHandleLike'

const useBlogs = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs,
    retry: 1,
    refetchOnWindowFocus: false
  })
}

const removeBlogMutation = (id, queryClient) => {
  return queryClient.setQueryData(['blogs'], (oldBlogs) =>
    oldBlogs.filter((blog) => blog.id !== id)
  )
}

const BlogList = ({ loggedInUser }) => {
  const blogFormRef = useRef()
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const { data: blogs, isLoading, isError } = useBlogs()

  const handleLike = useHandleLike()

  const handleRemove = async (id) => {
    const blog = blogs.find((blog) => blog.id === id)

    const removeBlogItem = async (id) => {
      try {
        await removeBlog(id)
        removeBlogMutation(id, queryClient)
        dispatch({
          type: 'SET_SUCCESS_NOTIFICATION',
          payload: `Blog ${blog.title} by ${blog.author} removed`
        })
      } catch (error) {
        console.error('Error removing blog:', error)
        dispatch({
          type: 'SET_ERROR_NOTIFICATION',
          payload: 'Error removing blog'
        })
      }
    }

    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      removeBlogItem(id)
    }
  }

  return (
    <>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm blogFormRef={blogFormRef} />
      </Togglable>
      {!isLoading &&
        !isError &&
        blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              handleLike={handleLike}
              handleRemove={handleRemove}
              loggedInUser={loggedInUser}
            />
          ))}
      {isLoading && <Loading />}
      {isError && (
        <Error message="Fetching the blogs failed. Please try again later." />
      )}
    </>
  )
}

BlogList.propTypes = {
  loggedInUser: PropTypes.object.isRequired
}

export default BlogList
