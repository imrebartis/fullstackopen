const bcryptjs = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  })
  response.json(users)
})

usersRouter.get('/:id', async (request, response, next) => {
  try {
    const user = await User.findById(request.params.id).populate('blogs', {
      url: 1,
      title: 1,
      author: 1,
      id: 1,
    })
    if (user) {
      response.json({
        id: user._id,
        username: user.username,
        name: user.name,
        blogs: user.blogs,
      })
    } else {
      response.status(404).send({ error: 'User not found' })
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  if (!username || !name || !password) {
    return next({
      name: 'MissingUserFieldsError',
      message: 'username, name and password must be provided',
    })
  }

  if (password.length < 3) {
    return next({
      name: 'ValidationError',
      message: 'password must be at least 3 characters long',
    })
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
