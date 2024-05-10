const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const favorite = blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog, { likes: -Infinity })

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorWithMostBlogs = _.chain(blogs)
    .countBy('author')
    .toPairs()
    .maxBy(_.last)
    .head()
    .value()

  const numberOfBlogs = _.chain(blogs)
    .countBy('author')
    .value()[authorWithMostBlogs]

  return {
    author: authorWithMostBlogs,
    blogs: numberOfBlogs
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}