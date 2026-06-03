require("dotenv").config()
const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const mongoose = require("mongoose")

const Book = require("./models/book")
const Author = require("./models/author")

mongoose.set("strictQuery", false)

const MONGODB_URI = process.env.MONGODB_URI

console.log("connecting to", MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message)
  })

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
    born: Int
    id: ID!
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (_, args) => {
      const author = args.author
        ? await Author.findOne({ name: args.author })
        : null

      const doesNotHaveAuthor = args.author && !author

      if (doesNotHaveAuthor) {
        return []
      }

      const filter = {
        ...(args.genre && { genres: { $in: [args.genre] } }),
        ...(author && { author: author._id }),
      }

      return Book.find(filter).populate("author")
    },
    allAuthors: async () => Author.find({}),
  },
  Author: {
    bookCount: async (root) =>
      Book.collection.countDocuments({ author: root._id }),
  },
  Mutation: {
    addBook: async (_, args) => {
      const existingAuthor = await Author.findOne({ name: args.author })
      const author =
        existingAuthor ?? (await new Author({ name: args.author }).save())

      const book = new Book({ ...args, author: author._id })
      await book.save()
      return book.populate("author")
    },
    editAuthor: async (_, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }

      author.born = args.setBornTo
      return author.save()
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
