const blogsRouter = require('express').Router()

const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  if (body.likes !== undefined && typeof body.likes !== 'number') {
    return next({ name: 'LikesNotANumberError', message: 'likes must be a number' })
  }

  if (!body.likes) {
    body.likes = 0
  }

  if (!body.title || !body.url) {
    return next({ name: 'MissingBlogFieldsError', message: 'title and url are required fields' })
  }

  const blog = new Blog(body)

  try {
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      await Blog.deleteOne({ _id: blog._id })
      response.status(204).end()
    } else {
      response.status(404).end()
    }
  } catch (error) {
    if (error.name === 'CastError') {
      response.status(404).send({ error: 'incorrect id' })
    } else {
      next(error)
    }
  }
})

blogsRouter.patch('/:id', async (request, response, next) => {
  const { likes } = request.body

  if (likes === undefined || typeof likes !== 'number') {
    return next({ name: 'LikesNotANumberError', message: 'likes must be a number' })
  }

  try {
    const blog = await Blog.findOne({ _id: request.params.id })

    if (!blog) {
      return response.status(404).send({ error: 'blog not found' })
    }

    blog.likes = likes
    const updatedBlog = await blog.save()
    response.status(200).json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
