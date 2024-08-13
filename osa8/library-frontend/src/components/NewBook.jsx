import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries'

const NewBook = ({ show, setError, setSuccess }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState({ name: '' })
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [createBook] = useMutation(CREATE_BOOK, {
    update: (cache, response) => {
      const addedBook = response.data.addBook

      cache.updateQuery({ query: ALL_BOOKS }, (data) => {
        const isIncluded = data.allBooks.find((b) => b.id === addedBook.id)
        if (!isIncluded) {
          return {
            allBooks: [...data.allBooks, addedBook]
          }
        }
        return data
      })

      cache.updateQuery({ query: ALL_AUTHORS }, (data) => {
        const isIncluded = data.allAuthors.find(
          (a) => a.name === addedBook.author.name
        )
        if (!isIncluded) {
          return {
            allAuthors: [
              ...data.allAuthors,
              {
                ...addedBook.author,
                born: addedBook.author.born,
                bookCount: addedBook.author.bookCount
              }
            ]
          }
        }
        return data
      })
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const messages = error.graphQLErrors.map((e) => e.message).join('\n')
        setError(messages)
      } else {
        setError('An error occurred')
      }
    },
    onCompleted: () => {
      setSuccess('Book added successfully')
    }
  })

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    createBook({
      variables: {
        title,
        author: author.name,
        published: Number(published),
        genres
      }
    })

    setTitle('')
    setPublished('')
    setAuthor({ name: '' })
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            required
          />
        </div>
        <div>
          author
          <input
            value={author.name}
            onChange={({ target }) => setAuthor({ name: target.value })}
            required
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => {
              setGenre(target.value)
            }}
          />
          <button onClick={addGenre} type='button'>
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook
