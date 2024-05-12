const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')

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

test.only('MongoDB assigns an id property when a blog is added', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://www.testblog.com',
    likes: 0
  }

  const returnedObject = await api.post('/api/blogs').send(newBlog)

  assert.ok(returnedObject.body.hasOwnProperty('id'), 'The object does not have an id property')
  assert.strictEqual(typeof returnedObject.body.id, 'string', 'the id is not a string')
})

after(async () => {
  await mongoose.connection.close()
})
