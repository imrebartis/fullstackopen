const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { listWithNoBlogs, listWithOneBlog, listWithSeveralBlogs } = require('../utils/blogLists')

describe('favorite blog', () => {

  test('of empty list is null', () => {
    const result = listHelper.favoriteBlog(listWithNoBlogs)
    assert.strictEqual(result, null)
  })

  test('when list has only one blog equals the blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(result, {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test('of a bigger list is the last blog listed in the array with most likes', () => {
    const result = listHelper.favoriteBlog(listWithSeveralBlogs)
    assert.deepStrictEqual(result, {
      title: 'Canonical string reduction 2',
      author: 'Edsger W. Dijkstra the 2nd',
      likes: 12
    })
  })

})
