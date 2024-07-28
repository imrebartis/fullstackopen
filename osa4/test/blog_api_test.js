const { test, after, before, beforeEach, describe } = require('node:test')
const request = require('supertest')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcryptjs = require('bcryptjs')

const helper = require('./test_helper')

const User = require('../models/user')
const Blog = require('../models/blog')

const {
  newBlog,
  newBlogWithNoLikes,
  blogWithNoTitle,
  blogWithNoUrl,
  blogWithLikesThatAreNotNumbers,
} = require('../utils/blogLists')

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, 2)
})

describe('post blog', () => {
  let agent
  let token

  before(async () => {
    agent = request.agent(app)

    await User.deleteOne({ username: 'newuser' })

    const passwordHash = await bcryptjs.hash('newpassword', 10)
    const user = new User({ username: 'newuser', passwordHash })
    await user.save()

    const loginResponse = await agent
      .post('/api/login')
      .send({ username: 'newuser', password: 'newpassword' })

    assert.strictEqual(loginResponse.status, 200)

    token = loginResponse.body.token
  })

  test('should create a new blog when authenticated', async () => {
    const response = await agent
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)

    assert.strictEqual(response.status, 201)

    for (const [key, value] of Object.entries(newBlog)) {
      assert.strictEqual(response.body[key], value)
    }
  })

  test('should return 401 Unauthorized if token is missing', async () => {
    const response = await agent.post('/api/blogs').send(newBlog)

    assert.strictEqual(response.status, 401)
  })

  test('MongoDB assigns an id property when a blog is added', async () => {
    const returnedObject = await agent
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)

    assert.ok(
      Object.prototype.hasOwnProperty.call(returnedObject.body, 'id'),
      'The object does not have an id property'
    )
    assert.strictEqual(
      typeof returnedObject.body.id,
      'string',
      'the id is not a string'
    )
  })

  test('the number of blogs increases by one after a new blog is posted', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const startLength = blogsAtStart.body.length

    const response = await agent
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)

    assert.strictEqual(response.status, 201)

    const blogsAtEnd = await api.get('/api/blogs')
    const endLength = blogsAtEnd.body.length

    assert.strictEqual(endLength, startLength + 1)
  })

  test("the posted blog's content is correct", async () => {
    const returnedObject = await agent
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)

    assert.strictEqual(returnedObject.body.title, newBlog.title)
    assert.strictEqual(returnedObject.body.author, newBlog.author)
    assert.strictEqual(returnedObject.body.url, newBlog.url)
    assert.strictEqual(returnedObject.body.likes, newBlog.likes)
  })

  test('a blog with no likes set has 0 likes', async () => {
    const returnedObject = await agent
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogWithNoLikes)

    assert.strictEqual(returnedObject.body.likes, 0)
  })

  test('a blog with likes that are not numbers cannot be posted', async () => {
    const returnedObject = await agent
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogWithLikesThatAreNotNumbers)

    assert.strictEqual(returnedObject.body.error, 'likes must be a number')
    assert.strictEqual(returnedObject.status, 400)
  })

  test('blogs with no title cannot be posted', async () => {
    const returnedObject = await agent
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogWithNoTitle)

    assert.strictEqual(
      returnedObject.body.error,
      'title and url are required fields'
    )
    assert.strictEqual(returnedObject.status, 400)
  })

  test('blogs with no url cannot be posted', async () => {
    const returnedObject = await agent
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogWithNoUrl)

    assert.strictEqual(
      returnedObject.body.error,
      'title and url are required fields'
    )
    assert.strictEqual(returnedObject.status, 400)
  })
})

describe('delete blog', () => {
  let agent
  let token

  before(async () => {
    agent = request.agent(app)

    await User.deleteOne({ username: 'newuser' })

    const passwordHash = await bcryptjs.hash('newpassword', 10)
    const user = new User({ username: 'newuser', passwordHash })
    await user.save()

    let loginResponse = await agent
      .post('/api/login')
      .send({ username: 'newuser', password: 'newpassword' })

    if (loginResponse.status === 401) {
      const passwordHash = await bcryptjs.hash('newpassword', 10)
      const user = new User({ username: 'newuser', passwordHash })
      await user.save()
    }

    loginResponse = await agent
      .post('/api/login')
      .send({ username: 'newuser', password: 'newpassword' })

    assert.strictEqual(loginResponse.status, 200)

    token = loginResponse.body.token
  })

  test('if blog id is correct, the blog is deleted', async () => {
    const createdBlog = await agent
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)

    const deleteResponse = await agent
      .delete(`/api/blogs/${createdBlog.body.id}`)
      .set('Authorization', `Bearer ${token}`)

    assert.strictEqual(deleteResponse.status, 204)

    const response = await api.get('/api/blogs')
    const ids = response.body.map((blog) => blog.id)
    assert.ok(!ids.includes(createdBlog.body.id))
  })

  test('if blog id is incorrect, the response is a 404 error', async () => {
    const deleteResponse = await agent
      .delete('/api/blogs/1234567890')
      .set('Authorization', `Bearer ${token}`)

    assert.strictEqual(deleteResponse.status, 404)
  })
})

describe('update blog', () => {
  let agent
  let token

  before(async () => {
    agent = request.agent(app)

    await User.deleteOne({ username: 'newuser' })

    const passwordHash = await bcryptjs.hash('newpassword', 10)
    const user = new User({ username: 'newuser', passwordHash })
    await user.save()

    let loginResponse = await agent
      .post('/api/login')
      .send({ username: 'newuser', password: 'newpassword' })

    if (loginResponse.status === 401) {
      const passwordHash = await bcryptjs.hash('newpassword', 10)
      const user = new User({ username: 'newuser', passwordHash })
      await user.save()
    }

    loginResponse = await agent
      .post('/api/login')
      .send({ username: 'newuser', password: 'newpassword' })

    assert.strictEqual(loginResponse.status, 200)

    token = loginResponse.body.token
  })

  test('if blog id is correct, the blog is updated', async () => {
    const createdBlog = await agent
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)

    const updatedBlog = { ...newBlog, likes: 1 }

    await api
      .patch(`/api/blogs/${createdBlog.body.id}`)
      .expect(200)
      .send(updatedBlog)

    const response = await api
      .get(`/api/blogs/${createdBlog.body.id}`)
      .send(newBlog)
    assert.strictEqual(response.body.likes, updatedBlog.likes)
  })

  test('if likes is not a number, the response is a 400 error', async () => {
    const createdBlog = await api.post('/api/blogs').send(newBlog)

    const updatedBlog = { ...newBlog, likes: '2' }
    await api
      .patch(`/api/blogs/${createdBlog.body.id}`)
      .send(updatedBlog)
      .expect(400)
  })

  test('if blog id is incorrect, the response is a 404 error', async () => {
    const updatedBlog = { ...newBlog, likes: 2 }
    await api
      .patch('/api/blogs/60d6c47e3cf8b1984ec2f3de')
      .send(updatedBlog)
      .expect(404)
  })
})

describe('when there is initially one user in the db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcryptjs.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'password123',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(result.body.error, 'expected `username` to be unique')
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'missingUsername',
      password: 'salainen',
    }

    const result = await api.post('/api/users').send(newUser)

    assert.strictEqual(
      result.body.error,
      'username, name and password must be provided'
    )
    assert.strictEqual(result.status, 400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)

    const names = usersAtEnd.map((u) => u.name)
    assert(!names.includes(newUser.name))
  })

  test('creation fails with proper statuscode and message if name is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'missingName',
      password: 'salainen',
    }

    const result = await api.post('/api/users').send(newUser)

    assert.strictEqual(
      result.body.error,
      'username, name and password must be provided'
    )
    assert.strictEqual(result.status, 400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)

    const usernames = usersAtEnd.map((u) => u.username)
    assert(!usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'missingPassword',
      name: 'Superuser',
    }

    const result = await api.post('/api/users').send(newUser)

    assert.strictEqual(
      result.body.error,
      'username, name and password must be provided'
    )
    assert.strictEqual(result.status, 400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)

    const usernames = usersAtEnd.map((u) => u.username)
    assert(!usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'passwordTooShort',
      name: 'Superuser',
      password: '12',
    }

    const result = await api.post('/api/users').send(newUser)

    assert.strictEqual(
      result.body.error,
      'password must be at least 3 characters long'
    )
    assert.strictEqual(result.status, 400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)

    const usernames = usersAtEnd.map((u) => u.username)
    assert(!usernames.includes(newUser.username))
  })
})

after(async () => {
  await mongoose.connection.close()
})
