import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { ALL_AUTHORS } from '../queries'
import Notify from './Notify'

const Authors = ({ show }) => {
  const result = useQuery(ALL_AUTHORS)
  const [errorMessage, setErrorMessage] = useState(null)

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  useEffect(() => {
    if (result.error) {
      console.log('error', result.error)
      const errorMessage = result.error.message || 'An error occurred'
      notify(errorMessage)
    }
  }, [result.error])

  if (!show) {
    return null
  }

  return (
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
  )
}

export default Authors
