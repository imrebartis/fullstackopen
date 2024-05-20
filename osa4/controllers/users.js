const bcryptjs = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  const blogs = await Blog.find({})

  const blogsFormatted = blogs.map(blog => ({
    url: blog.url,
    title: blog.title,
    author: blog.author,
    id: blog._id
  }))

  const usersWithAllBlogs = users.map(user => {
    const userObject = user.toJSON()
    return {
      ...userObject,
      blogs: blogsFormatted
    }
  })

  response.json(usersWithAllBlogs)
})

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  if (!username || !name || !password) {
    return next({ name: 'MissingUserFieldsError', message: 'username, name and password must be provided' })
  }

  if (password.length < 3) {
    return next({ name: 'ValidationError', message: 'password must be at least 3 characters long' })
  }

  const saltRounds = 10
  const passwordHash = await bcryptjs.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  try {
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
