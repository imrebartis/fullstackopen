import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import Notify from './Notify'
import useErrorNotification from '../hooks/useErrorNotification'

const Books = ({ show }) => {
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState(null)
  const result = useQuery(ALL_BOOKS)
  const errorMessage = useErrorNotification(result)

  const cleanGenre = (genre) => {
    let cleaned = genre.trim()
    cleaned = cleaned.replace(/^["'](.+(?=["']$))["']$/, '$1')
    return cleaned.toLowerCase()
  }

  useEffect(() => {
    if (result.data && result.data.allBooks) {
      const genresSet = new Set()

      result.data.allBooks.forEach((book) => {
        book.genres.forEach((genre) => {
          genre.split(',').forEach((g) => {
            genresSet.add(cleanGenre(g))
          })
        })
      })

      if (genresSet.size > 0) {
        setGenres(Array.from(genresSet))
      }
    }
  }, [result.data])

  if (!show) {
    return null
  }

  const filteredBooks = selectedGenre
    ? result.data.allBooks.filter((book) =>
        book.genres.some((genre) =>
          genre
            .split(',')
            .some((g) => cleanGenre(g) === selectedGenre.toLowerCase())
        )
      )
    : result.data.allBooks

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
            {filteredBooks.map((b) => (
              <tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {genres.length > 0 && (
        <div>
          {genres.map((genre) => (
            <button key={genre} onClick={() => setSelectedGenre(genre)}>
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
