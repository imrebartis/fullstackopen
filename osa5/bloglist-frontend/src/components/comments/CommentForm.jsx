import React, { useState } from 'react'
import { Button, TextField } from '@mui/material'

const CommentForm = ({ onAddComment }) => {
  const [comment, setComment] = useState('')

  const inputStyle = {
    marginRight: '8px'
  }

  const inputPropsStyle = {
    height: '40px',
    padding: '0 14px',
    boxSizing: 'border-box'
  }

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
      <TextField
        sx={inputStyle}
        InputProps={{
          style: inputPropsStyle
        }}
        type="text"
        value={comment}
        onChange={handleInputChange}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        add comment
      </Button>
    </div>
  )
}

export default CommentForm
