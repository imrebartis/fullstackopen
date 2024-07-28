import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useLoginValue, useLoginDispatch } from './LoginContext'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import {
  useNotificationValue,
  useNotificationDispatch
} from './NotificationContext'
import UserDetails from './components/UserDetails'
import BlogDetails from './components/BlogDetails'
import Users from './components/Users'
import BlogsList from './components/BlogsList'
import './index.css'
import Menu from './components/Menu'

const App = () => {
  const { user, username, password } = useLoginValue()
  const { setUser, setUsername, setPassword } = useLoginDispatch()
  const notification = useNotificationValue()
  const dispatch = useNotificationDispatch()

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
  }, [setUser, dispatch])

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
      console.error('Error logging in:', exception)
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

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {notification && <Notification message={notification} />}
        <LoginForm handleLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <Menu user={user} handleLogout={handleLogout} />
      <h1>Blog App</h1>
      {notification && <Notification message={notification} />}
      <Routes>
        <Route path="users/:id" element={<UserDetails />} />
        <Route path="blogs/:id" element={<BlogDetails loggedInUser={user} />} />
        <Route path="users" element={<Users />} />
        <Route path="*" element={<BlogsList />} />
      </Routes>
    </div>
  )
}

export default App
