const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcryptjs = require('bcryptjs')

const helper = require('./test_helper')

const User = require('../models/user')
const Blog = require('../models/blog')

const { newBlog, newBlogWithNoLikes, blogWithNoTitle, blogWithNoUrl, blogWithLikesThatAreNotNumbers } = require('../utils/blogLists')

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
  test('MongoDB assigns an id property when a blog is added', async () => {

    const returnedObject = await api.post('/api/blogs').send(newBlog)

    assert.ok(returnedObject.body.hasOwnProperty('id'), 'The object does not have an id property')
    assert.strictEqual(typeof returnedObject.body.id, 'string', 'the id is not a string')
  })

  test('the number of blogs increases by one after a new blog is posted', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const startLength = blogsAtStart.body.length

    await api.post('/api/blogs').send(newBlog)

    const blogsAtEnd = await api.get('/api/blogs')
    const endLength = blogsAtEnd.body.length

    assert.strictEqual(endLength, startLength + 1)
  })

  test('the posted blog\'s content is correct', async () => {

    const returnedObject = await api.post('/api/blogs').send(newBlog)

    assert.strictEqual(returnedObject.body.title, newBlog.title)
    assert.strictEqual(returnedObject.body.author, newBlog.author)
    assert.strictEqual(returnedObject.body.url, newBlog.url)
    assert.strictEqual(returnedObject.body.likes, newBlog.likes)
  })

  test('a blog with no likes set has 0 likes', async () => {

    const returnedObject = await api.post('/api/blogs').send(newBlogWithNoLikes)

    assert.strictEqual(returnedObject.body.likes, 0)
  })

  test('a blog with likes that are not numbers cannot be posted', async () => {
    const returnedObject = await api.post('/api/blogs').send(blogWithLikesThatAreNotNumbers)

    assert.strictEqual(returnedObject.status, 400)
  })

  test('blogs with no title cannot be posted', async () => {

    const returnedObject = await api.post('/api/blogs').send(blogWithNoTitle)

    assert.strictEqual(returnedObject.status, 400)
  })

  test('blogs with no url cannot be posted', async () => {

    const returnedObject = await api.post('/api/blogs').send(blogWithNoUrl)

    assert.strictEqual(returnedObject.status, 400)
  })
})

describe('delete blog', () => {
  test('if blog id is correct, the blog is deleted', async () => {

    const createdBlog = await api.post('/api/blogs').send(newBlog)

    const deleteResponse = await api.delete(`/api/blogs/${createdBlog.body.id}`)
    assert.strictEqual(deleteResponse.status, 204)

    const response = await api.get('/api/blogs')
    const ids = response.body.map(blog => blog.id)
    assert.ok(!ids.includes(createdBlog.body.id))
  })

  test('if blog id is incorrect, the response is a 404 error', async () => {
    const deleteResponse = await api.delete('/api/blogs/1234567890')
    assert.strictEqual(deleteResponse.status, 404)
  })
})

describe('update blog', () => {
  test('if blog id is correct, the blog is updated', async () => {

    const createdBlog = await api.post('/api/blogs').send(newBlog)

    const updatedBlog = { ...newBlog, likes: 1 }

    await api.patch(`/api/blogs/${createdBlog.body.id}`).expect(200).send(updatedBlog)

    const response = await api.get(`/api/blogs/${createdBlog.body.id}`).send(newBlog)
    assert.strictEqual(response.body.likes, updatedBlog.likes)
  })

  test('if likes is not a number, the response is a 400 error', async () => {
    const createdBlog = await api.post('/api/blogs').send(newBlog)

    const updatedBlog = { ...newBlog, likes: '2' }
    await api.patch(`/api/blogs/${createdBlog.body.id}`).send(updatedBlog).expect(400)
  })

  test('if blog id is incorrect, the response is a 404 error', async () => {
    const updatedBlog = { ...newBlog, likes: 2 }
    await api.patch('/api/blogs/60d6c47e3cf8b1984ec2f3de').send(updatedBlog).expect(404)
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

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
})


after(async () => {
  await mongoose.connection.close()
})
