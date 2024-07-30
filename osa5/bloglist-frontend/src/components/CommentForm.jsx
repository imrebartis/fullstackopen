import React, { useState } from 'react'

const CommentForm = ({ onAddComment }) => {
  const [comment, setComment] = useState('')

  const handleInputChange = (event) => {
    setComment(event.target.value)
  }

  const handleSubmit = () => {
    const trimmedComment = comment.trim()
    if (trimmedComment === '') {
      onAddComment(null, 'Comments cannot be empty')
    } else {
      onAddComment(trimmedComment)
      setComment('')
    }
  }

  return (
    <div>
      <input type="text" value={comment} onChange={handleInputChange} />
      <button onClick={handleSubmit}>add comment</button>
    </div>
  )
}

export default CommentForm
