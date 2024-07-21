import { useState, useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Blog from './components/Blog'
import blogService from './services/blogs'
import { getBlogs, updateBlog, removeBlog } from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import {
  useNotificationValue,
  useNotificationDispatch
} from './NotificationContext'

import './index.css'

const useBlogs = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs,
    retry: 1,
    refetchOnWindowFocus: false
  })
}

const updateBlogMutation = (updatedBlog, queryClient) => {
  return queryClient.setQueryData(['blogs'], (oldBlogs) =>
    oldBlogs.map((blog) => (blog.id !== updatedBlog.id ? blog : updatedBlog))
  )
}

const removeBlogMutation = (id, queryClient) => {
  return queryClient.setQueryData(['blogs'], (oldBlogs) =>
    oldBlogs.filter((blog) => blog.id !== id)
  )
}

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const { data: blogs, isLoading, isError } = useBlogs()
  const queryClient = useQueryClient()
  const notification = useNotificationValue()
  const dispatch = useNotificationDispatch()

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      try {
        const user = JSON.parse(loggedUserJSON)
        setUser(user)
        blogService.setToken(user.token)
      } catch (error) {
        console.error(error)
        dispatch({
          type: 'SET_ERROR_NOTIFICATION',
          payload: 'Error fetching user'
        })
      }
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      dispatch({
        type: 'SET_SUCCESS_NOTIFICATION',
        payload: `Welcome back, ${user.name}!`
      })
    } catch (exception) {
      if (exception.response && exception.response.status === 401) {
        dispatch({
          type: 'SET_ERROR_NOTIFICATION',
          payload: 'Wrong credentials'
        })
      } else {
        dispatch({
          type: 'SET_ERROR_NOTIFICATION',
          payload: 'Could not connect to the server. Please try again later.'
        })
      }
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    dispatch({
      type: 'SET_SUCCESS_NOTIFICATION',
      payload: `You have been logged out successfully.`
    })
  }

  const handleLike = async (blog) => {
    console.log('like', blog.id)
    const updatedBlog = { ...blog, likes: (blog.likes || 0) + 1 }
    try {
      async function updateBlogOnVote(updatedBlog) {
        await updateBlog(updatedBlog)
        updateBlogMutation(updatedBlog, queryClient)
      }
      await updateBlogOnVote(updatedBlog)
      dispatch({
        type: 'SET_SUCCESS_NOTIFICATION',
        payload: `you voted "${blog.title}"`
      })
    } catch (error) {
      console.error(error)
      dispatch({
        type: 'SET_ERROR_NOTIFICATION',
        payload: 'Error updating blog'
      })
    }
  }

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
        if (error.response && error.response.status === 403) {
          dispatch({
            type: 'SET_ERROR_NOTIFICATION',
            payload: 'You can only remove blogs that you added.'
          })
        } else {
          dispatch({
            type: 'SET_ERROR_NOTIFICATION',
            payload: 'Error removing blog'
          })
        }
      }
    }

    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      removeBlogItem(id)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {notification && <Notification message={notification} />}
        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {notification && <Notification message={notification} />}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <p>{user.name} logged in</p>
        <button
          data-testid="logout-button"
          onClick={handleLogout}
          style={{ marginLeft: '8px' }}
        >
          log out
        </button>
      </div>
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
              loggedInUser={user}
            />
          ))}
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error fetching blogs</div>}
    </div>
  )
}

export default App
