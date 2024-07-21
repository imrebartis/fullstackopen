import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import Blog from './components/Blog'
import blogService from './services/blogs'
import { getAll } from './services/blogs'
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
    queryFn: getAll,
    retry: 1,
    refetchOnWindowFocus: false
  })
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const { data: blogsRQ, isLoading, isError } = useBlogs()
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
        <BlogForm />
      </Togglable>
      {!isLoading &&
        !isError &&
        blogsRQ
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
