import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationDispatch } from '../NotificationContext'
import { createComment } from '../services/comments'
import CommentForm from './CommentForm'

const CommentsList = ({ blog }) => {
  const dispatch = useNotificationDispatch()
  const queryClient = useQueryClient()

  const newCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: (newComment) => {
      queryClient.setQueryData(['blogs', blog.id], (oldBlog) => {
        if (!oldBlog) {
          return {
            ...blog,
            comments: [newComment]
          }
        }
        return {
          ...oldBlog,
          comments: oldBlog.comments
            ? [...oldBlog.comments, newComment]
            : [newComment]
        }
      })
      dispatch({
        type: 'SET_SUCCESS_NOTIFICATION',
        payload: 'Comment added'
      })
      queryClient.invalidateQueries(['blogs', blog.id])
    },
    onError: (error) => {
      console.error('Error adding comment:', error)
      dispatch({
        type: 'SET_ERROR_NOTIFICATION',
        payload: 'Error adding comment'
      })
    }
  })

  const addComment = (content, error) => {
    if (error) {
      dispatch({
        type: 'SET_ERROR_NOTIFICATION',
        payload: error
      })
    } else {
      newCommentMutation.mutate({ content, blog: blog.id })
    }
  }

  if (!blog.comments) {
    return (
      <div>
        <h3>Comments</h3>
        <p>No comments added yet</p>
      </div>
    )
  }

  return (
    <div>
      <h3>Comments</h3>
      <CommentForm onAddComment={addComment} />
      {blog.comments.length === 0 ? (
        <p>No comments added yet</p>
      ) : (
        <ul>
          {blog.comments.map((comment, index) => (
            <li key={index}>{comment.content}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CommentsList
