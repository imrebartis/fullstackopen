import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Notify from './components/Notify'

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

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

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
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
