import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
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

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const notification = useNotificationValue()
  const dispatch = useNotificationDispatch()

  const blogFormRef = useRef()

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await blogService.getAll()
        setBlogs(blogs)
      } catch (error) {
        console.error(error)
        dispatch({
          type: 'SET_ERROR_NOTIFICATION',
          payload: 'Error fetching blogs'
        })
      }
    }

    fetchBlogs()
  }, [])

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
    setIsLoading(false)
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

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()

    const createBlog = async (blogObject) => {
      try {
        const returnedBlog = await blogService.create(blogObject)
        returnedBlog.user = user
        setBlogs([...blogs, returnedBlog])
        dispatch({
          type: 'SET_SUCCESS_NOTIFICATION',
          payload: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
        })
      } catch (error) {
        console.error('Error creating blog:', error)
        if (error.response && error.response.status === 401) {
          dispatch({
            type: 'SET_ERROR_NOTIFICATION',
            payload: 'Your session has expired. Please log in again.'
          })
        } else {
          dispatch({
            type: 'SET_ERROR_NOTIFICATION',
            payload: 'Error creating blog'
          })
        }
      }
    }

    createBlog(blogObject)
  }

  const handleLike = async (id) => {
    const blog = blogs.find((blog) => blog.id === id)
    const updatedBlog = { ...blog, likes: blog.likes + 1 }

    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      returnedBlog.user = blog.user
      setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)))
    } catch (error) {
      console.error('Error updating blog:', error)
      dispatch({
        type: 'SET_ERROR_NOTIFICATION',
        payload: 'Error updating blog'
      })
    }
  }

  const handleRemove = async (id) => {
    const blog = blogs.find((blog) => blog.id === id)

    const removeBlog = async (id) => {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter((blog) => blog.id !== id))
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
      removeBlog(id)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
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
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {blogs
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
    </div>
  )
}

export default App
