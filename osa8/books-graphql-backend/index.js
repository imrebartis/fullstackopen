const { ApolloServer } = require('@apollo/server')
const {
  ApolloServerPluginDrainHttpServer
} = require('@apollo/server/plugin/drainHttpServer')
const { expressMiddleware } = require('@apollo/server/express4')
const { GraphQLError } = require('graphql')
const cors = require('cors')
const express = require('express')
const http = require('http')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
 */

const typeDefs = `
type Book {
  title: String!
  published: Int!
  author: Author!
  id: ID!
  genres: [String!]!
}

type Author {
  name: String!
  id: ID!
  born: Int
  bookCount: Int
}

  type Query {
    bookCount: Int!,
    authorCount: Int!,
    allBooks(author: String, genre: String): [Book!]!,
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book!

     editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

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

      if (args.genres) {
        filter.genres = { $in: [args.genres] }
      }

      return Book.find(filter).populate('author')
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
    }
  },
  Author: {
    bookCount: (parent) =>
      Book.collection.countDocuments({ author: parent._id })
  },
  Mutation: {
    addBook: async (root, args) => {
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
      return newBook.populate('author')
    },
    editAuthor: async (root, args) => {
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
    }
  }
}

const app = express()
const httpServer = http.createServer(app)

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
})

server.start().then(() => {
  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true
    })
  )

  app.use(express.json())

  app.use('/graphql', expressMiddleware(server))

  httpServer.listen({ port: 4000 }, () => {
    console.log(`Server ready at http://localhost:4000/graphql`)
  })
})
