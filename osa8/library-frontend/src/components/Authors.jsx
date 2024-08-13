import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/client'
import Select from 'react-select'
import { ALL_AUTHORS } from '../queries'
import Notify from './Notify'
import useErrorNotification from '../hooks/useErrorNotification'
import { UPDATE_AUTHOR } from '../queries'

const Authors = ({ show, setError, setSuccess }) => {
  const result = useQuery(ALL_AUTHORS)
  const errorMessage = useErrorNotification(result)
  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [born, setBorn] = useState('')

  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    onError: (error) => {
      setError(error.message)
    },
    update: (cache, response) => {
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        return {
          allAuthors: allAuthors.map((a) =>
            a.name === response.data.editAuthor.name
              ? response.data.editAuthor
              : a
          )
        }
      })
    }
  })

  if (!show) {
    return null
  }

  const handleAuthorChange = (selectedOption) => {
    setSelectedAuthor(selectedOption)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await updateAuthor({
        variables: { name: selectedAuthor.value, setBornTo: Number(born) }
      })
      setSuccess("Author's birthyear updated")
      setSelectedAuthor(null)
      setBorn('')
    } catch (error) {
      setError(error.message)
    }
  }

  const authorOptions = result.data
    ? result.data.allAuthors.map((a) => ({ value: a.name, label: a.name }))
    : []

  return (
    <>
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>authors</h2>
        {result.loading && <div>loading...</div>}
        {!result.loading && !result.data && <div>No data available</div>}
        {result.data && (
          <table>
            <tbody>
              <tr>
                <th></th>
                <th>born</th>
                <th>books</th>
              </tr>
              {result.data.allAuthors.map((a) => (
                <tr key={a.name}>
                  <td>{a.name}</td>
                  <td>{a.born}</td>
                  <td>{a.bookCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div>
        <h2>Set birthyear</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <Select
              value={selectedAuthor}
              onChange={handleAuthorChange}
              options={authorOptions}
            />
          </div>
          <div>
            born
            <input
              value={born}
              onChange={({ target }) => setBorn(target.value)}
              required
            />
          </div>
          <button type='submit'>update author</button>
        </form>
      </div>
    </>
  )
}

export default Authors
