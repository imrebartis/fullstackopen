import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useNotificationDispatch } from '../NotificationContext'

const BlogForm = ({ createBlog, visible }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const dispatch = useNotificationDispatch()

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
      dispatch({
        type: 'SET_ERROR_NOTIFICATION',
        payload: 'Title and url are required'
      })
      return
    }

    if (!newTitle) {
      dispatch({
        type: 'SET_ERROR_NOTIFICATION',
        payload: 'Title is required'
      })
      return
    }

    if (!newUrl) {
      dispatch({
        type: 'SET_ERROR_NOTIFICATION',
        payload: 'Url is required'
      })
      return
    }

    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
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
          data-testid="title"
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
          data-testid="author"
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
          data-testid="url"
          id="url"
          name="url"
          value={newUrl}
          onChange={handleUrlChange}
          autoComplete="off"
        ></input>
      </div>
      <button data-testid="create-button" type="submit">
        create
      </button>
    </form>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm
