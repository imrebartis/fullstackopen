import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleLike, handleRemove, loggedInUser }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleLikeButtonClick = () => {
    handleLike(blog.id)
  }

  const handleRemoveButtonClick = () => {
    handleRemove(blog.id)
  }

  const showRemoveButton =
    loggedInUser && blog.user && loggedInUser.id === blog.user.id

  return (
    <div data-testid="blog" style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button
          data-testid="visibility-button"
          className="visibility-button"
          onClick={() => setVisible(!visible)}
          style={{ marginLeft: '8px', marginBottom: '8px' }}
        >
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      <div style={visible ? { display: '' } : { display: 'none' }}>
        <div data-testid="blog-url">{blog.url}</div>
        <div data-testid="blog-likes">
          likes {blog.likes}
          <button
            data-testid="like-button"
            onClick={handleLikeButtonClick}
            style={{ marginLeft: '8px' }}
          >
            like
          </button>
        </div>
        <div data-testid="blog-username" style={{ marginBottom: '8px' }}>
          {blog.user.name}
        </div>
        {showRemoveButton && (
          <button
            onClick={handleRemoveButtonClick}
            style={{ marginBottom: '8px' }}
          >
            remove
          </button>
        )}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object.isRequired,
}

export default Blog
