import { useState, useEffect } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'
import { ALL_BOOKS, BOOK_ADDED, ALL_AUTHORS } from './queries'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const updateCache = (cache, query, addedItem, key, defaultFields = {}) => {
    // helper used to avoid saving same item twice
    const uniqByKey = (a, key) => {
      let seen = new Set()
      return a.filter((item) => {
        let k = item[key]
        return seen.has(k) ? false : seen.add(k)
      })
    }

    cache.updateQuery(query, (data) => {
      if (!data) return data
      const items = data.allBooks || data.allAuthors
      if (!items) return data
      const newItem = { ...addedItem, ...defaultFields }
      return {
        ...data,
        allBooks: data.allBooks
          ? uniqByKey(items.concat(newItem), key)
          : undefined,
        allAuthors: data.allAuthors
          ? uniqByKey(items.concat(newItem), key)
          : undefined
      }
    })
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data?.data?.bookAdded
      if (addedBook) {
        window.alert(`New book added: ${addedBook.title}`)
        updateCache(client.cache, { query: ALL_BOOKS }, addedBook, 'title')
        updateCache(
          client.cache,
          { query: ALL_AUTHORS },
          addedBook.author,
          'name',
          { born: null, bookCount: 0 }
        )
      } else {
        console.error('No book added data received', data)
      }
    },
    onError: (error) => {
      console.error('Subscription error:', error)
    }
  })

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
        <button onClick={() => setPage('recommendations')}>
          recommendations
        </button>
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
      <Recommendations show={page === 'recommendations'} />
    </div>
  )
}

export default App
