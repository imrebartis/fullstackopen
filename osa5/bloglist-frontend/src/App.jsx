import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await blogService.getAll()
        setBlogs(blogs)
      } catch (error) {
        console.error(error)
        setErrorMessage('Error fetching blogs')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
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
        setErrorMessage('Error fetching user')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
    setIsLoading(false)
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setSuccessMessage(`Welcome back, ${user.name}!`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      if (exception.response && exception.response.status === 401) {
        setErrorMessage('Wrong credentials')
      } else {
        setErrorMessage(
          'Could not connect to the server. Please try again later.'
        )
      }
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    setSuccessMessage('You have been logged out successfully.')
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()

    const createBlog = async (blogObject) => {
      try {
        const returnedBlog = await blogService.create(blogObject)
        returnedBlog.user = user
        setBlogs([...blogs, returnedBlog])
        setSuccessMessage(
          `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
        )
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      } catch (error) {
        console.error('Error creating blog:', error)
        if (error.response && error.response.status === 401) {
          setErrorMessage('Your session has expired. Please log in again.')
        } else {
          setErrorMessage('Error creating blog')
        }
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
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
      setErrorMessage('Error updating blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleRemove = async (id) => {
    const blog = blogs.find((blog) => blog.id === id)

    const removeBlog = async (id) => {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter((blog) => blog.id !== id))
        setSuccessMessage(`Blog ${blog.title} by ${blog.author} removed`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      } catch (error) {
        console.error('Error removing blog:', error)
        if (error.response && error.response.status === 403) {
          setErrorMessage('You can only remove blogs that you added.')
        } else {
          setErrorMessage('Error removing blog')
        }
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
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
        <Notification
          successMessage={successMessage}
          errorMessage={errorMessage}
        />
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
      <Notification
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
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
        <BlogForm createBlog={addBlog} setErrorMessage={setErrorMessage} />
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
