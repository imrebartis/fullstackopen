const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { listWithNoBlogs, listWithOneBlog, listWithSeveralBlogs } = require('../utils/blogLists')

describe('most blogs', () => {

  test('of empty list is null', () => {
    const result = listHelper.mostBlogs(listWithNoBlogs)
    assert.strictEqual(result, null)
  })

  test('when list has only one blog equals the blog', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      blogs: 1
    })
  })

  test('of a bigger list is the first author found with the highest amount of blogs', () => {
    const result = listHelper.mostBlogs(listWithSeveralBlogs)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      blogs: 3
    })
  })
})
