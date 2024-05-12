const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')

const { newBlog, newBlogWithNoLikes } = require('../utils/blogLists')

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(helper.initialBlogs)
})

test('notes are returned as json', async () => {
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
})

after(async () => {
  await mongoose.connection.close()
})
