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

import './index.css'
import Users from './components/Users'
import BlogList from './components/BlogList'

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
      <Routes>
        <Route path="users/:id" element={<UserDetails />} />
        <Route path="users" element={<Users />} />
        <Route path="*" element={<BlogList loggedInUser={user} />} />
      </Routes>
    </div>
  )
}

export default App
