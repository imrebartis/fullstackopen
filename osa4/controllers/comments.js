const commentsRouter = require('express').Router()
const Blog = require('../models/blog')
const Comment = require('../models/comment')

commentsRouter.post('/:id/comments', async (request, response, next) => {
  const { id } = request.params
  const { content } = request.body

  if (!content) {
    return response.status(400).json({ error: 'content is required' })
  }

  const comment = new Comment({
    content,
    blog: id,
  })

  try {
    const savedComment = await comment.save()

    const blog = await Blog.findById(id)
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    blog.comments = blog.comments.concat(savedComment._id)
    await blog.save()

    response.status(201).json(savedComment)
  } catch (error) {
    next(error)
  }
})

module.exports = commentsRouter
