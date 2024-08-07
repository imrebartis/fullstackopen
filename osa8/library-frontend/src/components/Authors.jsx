import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'
import Notify from './Notify'
import useErrorNotification from '../hooks/useErrorNotification'

const Authors = ({ show }) => {
  const result = useQuery(ALL_AUTHORS)
  const errorMessage = useErrorNotification(result)

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
