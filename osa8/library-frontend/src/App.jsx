import { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    const storedToken = localStorage.getItem('library-user-token')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notifyError = (message) => {
    setErrorMessage(message || 'An unexpected error occurred')
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const notifySuccess = (message) => {
    setSuccessMessage(message || 'Operation successful')
    setTimeout(() => {
      setSuccessMessage(null)
    }, 10000)
  }

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} successMessage={successMessage} />
        <h2>Login</h2>
        <LoginForm
          setToken={(token) => {
            setToken(token)
            localStorage.setItem('library-user-token', token)
          }}
          setError={notifyError}
          setSuccess={notifySuccess}
        />
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={logout}>logout</button>
      </div>

      <Notify errorMessage={errorMessage} successMessage={successMessage} />

      <Authors
        show={page === 'authors'}
        setError={notifyError}
        setSuccess={notifySuccess}
      />

      <Books show={page === 'books'} />

      <NewBook
        show={page === 'add'}
        setError={notifyError}
        setSuccess={notifySuccess}
      />
    </div>
  )
}

export default App
