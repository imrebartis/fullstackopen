const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const filter = {}

      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (author) {
          filter.author = author._id
        } else {
          return []
        }
      }

      if (args.genre) {
        const cleanedGenre = cleanGenre(args.genre)
        filter.genres = {
          $elemMatch: {
            $regex: new RegExp(`\\b${cleanedGenre}\\b`, 'i')
          }
        }
      }

      return Book.find(filter).populate('author')
    },
    allGenres: async () => {
      const books = await Book.find({}).populate('author')
      return Array.from(
        new Set(
          books.flatMap((book) =>
            book.genres.flatMap((genre) =>
              cleanGenre(genre)
                .split(',')
                .map((g) => g.trim())
            )
          )
        )
      )
    },
    allAuthors: async () => {
      const authors = await Author.aggregate([
        {
          $lookup: {
            from: 'books',
            localField: '_id',
            foreignField: 'author',
            as: 'books'
          }
        },
        {
          $addFields: {
            bookCount: { $size: '$books' }
          }
        },
        {
          $project: {
            books: 0
          }
        }
      ])
      return authors.map((author) => ({
        ...author,
        id: author._id
      }))
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: (parent) =>
      Book.collection.countDocuments({ author: parent._id })
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('You are not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      if (args.title.length < 5) {
        throw new GraphQLError('Title must be at least 5 characters long', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title
          }
        })
      }

      if (args.author.length < 4) {
        throw new GraphQLError(
          'Author name must be at least 4 characters long',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author
            }
          }
        )
      }

      const existingBook = await Book.findOne({ title: args.title })
      if (existingBook) {
        throw new GraphQLError('Title must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title
          }
        })
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
      }

      const newBook = new Book({ ...args, author: author._id })
      await newBook.save()
      const populatedBook = await newBook.populate('author')
      pubsub.publish('BOOK_ADDED', { bookAdded: newBook })

      return populatedBook
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('You are not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) {
        throw new GraphQLError('Author not found', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }

      author.born = args.setBornTo
      await author.save()
      return author
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre
      })
      return user.save().catch((error) => {
        throw (
          (new GraphQLError('Creating the user failed'),
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        )
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

const cleanGenre = (genre) => {
  let cleaned = genre.trim()
  cleaned = cleaned.replace(/^['"](.+?)['"]$/, '$1') // Remove surrounding quotes
  cleaned = cleaned.replace(/['"]/g, '') // Remove any remaining quotes within the string
  return cleaned.toLowerCase()
}

module.exports = resolvers
