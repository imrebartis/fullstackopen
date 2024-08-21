import { useQuery } from '@apollo/client'
import { ALL_BOOKS, USER } from '../queries'
import { cleanGenre } from '../utils/cleanGenre'

const Recommendations = ({ show }) => {
  const { data: userData, loading: userLoading } = useQuery(USER)
  const { data: booksData, loading: booksLoading } = useQuery(ALL_BOOKS)

  if (!show) {
    return null
  }

  if (userLoading || booksLoading) {
    return <div>loading...</div>
  }

  if (!userData || !booksData) {
    return <div>No data available</div>
  }

  const favoriteGenre = cleanGenre(userData.me.favoriteGenre)
  const filteredBooks = booksData.allBooks.filter((book) =>
    book.genres.some((genre) =>
      genre.split(',').some((g) => cleanGenre(g) === favoriteGenre)
    )
  )

  return (
    <div>
      <h2>Recommendations</h2>
      <p>
        Books in your favorite genre <strong>{favoriteGenre}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {filteredBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
