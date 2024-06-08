import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Blog from './Blog'

const BlogForm = ({ createBlog, setErrorMessage, visible }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  useEffect(() => {
    if (!visible) {
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
    }
  }, [visible])

  const addBlog = (event) => {
    event.preventDefault()

    if (!newTitle && !newUrl) {
      setErrorMessage('Title and url are required')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return
    }

    if (!newTitle) {
      setErrorMessage('Title is required')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return
    }

    if (!newUrl) {
      setErrorMessage('Url is required')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return
    }

    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  return (
    <form onSubmit={addBlog} style={{ marginBottom: '16px' }}>
      <h2>create new</h2>
      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}
      >
        title
        <input
          type="text"
          style={{ marginLeft: '8px' }}
          id="title"
          name="title"
          value={newTitle}
          onChange={handleTitleChange}
          autoComplete="off"
        ></input>
      </div>
      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}
      >
        author
        <input
          type="text"
          style={{ marginLeft: '8px' }}
          id="author"
          name="author"
          value={newAuthor}
          onChange={handleAuthorChange}
          autoComplete="off"
        ></input>
      </div>
      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}
      >
        url:
        <input
          type="text"
          style={{ marginLeft: '8px' }}
          id="url"
          name="url"
          value={newUrl}
          onChange={handleUrlChange}
          autoComplete="off"
        ></input>
      </div>
      <button type="submit">create</button>
    </form>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
}

export default BlogForm
