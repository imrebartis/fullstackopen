import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import Notify from './Notify'
import useErrorNotification from '../hooks/useErrorNotification'

const Books = ({ show }) => {
  const result = useQuery(ALL_BOOKS)
  const errorMessage = useErrorNotification(result)

  if (!show) {
    return null
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <h2>books</h2>
      {result.loading && <div>loading...</div>}
      {!result.loading && !result.data && <div>No data available</div>}
      {result.data && (
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {result.data.allBooks.map((b) => (
              <tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Books
