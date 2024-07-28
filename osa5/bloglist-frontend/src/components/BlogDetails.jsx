import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import propTypes from 'prop-types'
import { getBlog, removeBlog } from '../services/blogs'
import { getUsers } from '../services/users'
import { useNotificationDispatch } from '../NotificationContext'
import Loading from './Loading'
import Error from './Error'
import useHandleLike from '../hooks/useHandleLike'
import CommentsList from './CommentsList'

const removeBlogMutation = (id, queryClient) => {
  return queryClient.setQueryData(['blogs'], (oldBlogs) =>
    oldBlogs.filter((blog) => blog.id !== id)
  )
}

const BlogDetails = ({ loggedInUser }) => {
  const { id } = useParams()
  const handleLike = useHandleLike()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const {
    data: blog,
    isLoading: isBlogLoading,
    isError: isBlogError
  } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => getBlog(id)
  })

  const {
    data: users,
    isLoading: isUsersLoading,
    isError: isUsersError
  } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  })

  const showRemoveButton =
    loggedInUser && blog?.user && loggedInUser.id === blog?.user

  const handleRemoveButtonClick = async (id) => {
    const removeBlogItem = async (id) => {
      try {
        await removeBlog(id)
        removeBlogMutation(id, queryClient)
        navigate('/')
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

  if (isBlogLoading || isUsersLoading) {
    return <Loading />
  }

  if (isBlogError || isUsersError) {
    return <Error message="Error fetching data" />
  }

  if (!blog || !users) {
    return null
  }

  const user = users.find((user) => user.id === blog.user)

  return (
    <div data-testid="blog">
      <h2>{blog.title}</h2>
      <p>
        <a
          href={blog.url}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="blog-url"
        >
          {blog.url}
        </a>
      </p>
      <p>
        {blog.likes} likes{' '}
        <button onClick={() => handleLike(blog)}>like</button>
      </p>
      <p data-testid="blog-username">added by {user ? user.name : 'Unknown'}</p>
      {showRemoveButton && (
        <button
          data-testid="remove-button"
          onClick={() => handleRemoveButtonClick(blog.id)}
          style={{
            marginBottom: '8px'
          }}
        >
          remove
        </button>
      )}
      <CommentsList blog={blog} />
    </div>
  )
}

propTypes.BlogDetails = {
  loggedInUser: propTypes.object.isRequired
}

export default BlogDetails
