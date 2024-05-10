const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { listWithNoBlogs, listWithOneBlog, listWithSeveralBlogs } = require('../utils/blogLists')

describe('most likes', () => {

  test('of empty list is null', () => {
    const result = listHelper.mostLikes(listWithNoBlogs)
    assert.strictEqual(result, null)
  })

  test('when list has only one blog equals the blog', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test('of a bigger list is the first author found with the highest amount of likes', () => {
    const result = listHelper.mostLikes(listWithSeveralBlogs)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 29
    })
  })
})
