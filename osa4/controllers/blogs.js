const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog
      .find({}).sort({ createdAt: 1 }).populate('user', { username: 1, name: 1, id: 1 })
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

  const user = await User.findOne().sort({ createdAt: 1 })

  if (body.likes !== undefined && typeof body.likes !== 'number') {
    return next({ name: 'LikesNotANumberError', message: 'likes must be a number' })
  }

  if (!body.likes) {
    body.likes = 0
  }

  if (!body.title || !body.url) {
    return next({ name: 'MissingBlogFieldsError', message: 'title and url are required fields' })
  }

  if (!user) {
    return response.status(400).json({ error: 'user not found' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  try {
    const savedBlog = await blog.save()
    blog.user = user.blogs.concat(savedBlog._id)
    await user.save()

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
