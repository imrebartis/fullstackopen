import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ALL_GENRES } from '../queries'
import Notify from './Notify'
import useErrorNotification from '../hooks/useErrorNotification'

const Books = ({ show }) => {
  const [selectedGenre, setSelectedGenre] = useState(null)
  const {
    loading: loadingBooks,
    data: dataBooks,
    error: errorBooks,
    refetch: refetchBooks
  } = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre },
    onError: (error) => {
      console.error('Error fetching books:', error)
    }
  })
  const {
    loading: loadingGenres,
    data: dataGenres,
    error: errorGenres
  } = useQuery(ALL_GENRES, {
    onError: (error) => {
      console.error('Error fetching genres:', error)
    }
  })
  const errorMessage = useErrorNotification({
    error: errorBooks || errorGenres
  })

  useEffect(() => {
    if (show) {
      setSelectedGenre(null)
      refetchBooks()
    }
  }, [show, refetchBooks])

  if (!show) {
    return null
  }

  const books = dataBooks?.allBooks || []

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre)
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <h2>books</h2>
      {loadingBooks && loadingGenres && <div>loading...</div>}
      {!loadingBooks && !loadingGenres && books.length === 0 && (
        <div>No data available</div>
      )}
      {books.length > 0 && (
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {books.map((b) => (
              <tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!loadingGenres && dataGenres && dataGenres.allGenres && (
        <div>
          {dataGenres.allGenres.map((genre) => (
            <button key={genre} onClick={() => handleGenreClick(genre)}>
              {genre}
            </button>
          ))}
          <button onClick={() => setSelectedGenre(null)}>All genres</button>
        </div>
      )}
    </div>
  )
}

export default Books
