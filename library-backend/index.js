require("dotenv").config()
const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const { GraphQLError } = require("graphql")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

const Book = require("./models/book")
const Author = require("./models/author")
const User = require("./models/user")

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

  type Token {
    value: String!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
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
    me: (_, __, { currentUser }) => currentUser ?? null,
  },
  Author: {
    bookCount: async (root) =>
      Book.collection.countDocuments({ author: root._id }),
  },
  Mutation: {
    addBook: async (_, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: { code: "BAD_USER_INPUT" },
        })
      }

      const existingAuthor = await Author.findOne({ name: args.author })

      const author =
        existingAuthor ??
        (await new Author({ name: args.author }).save().catch((error) => {
          throw new GraphQLError("Saving author failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
              error,
            },
          })
        }))

      const book = new Book({ ...args, author: author._id })

      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError("Saving book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error,
          },
        })
      }

      return book.populate("author")
    },
    editAuthor: async (_, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: { code: "BAD_USER_INPUT" },
        })
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }

      author.born = args.setBornTo

      try {
        return await author.save()
      } catch (error) {
        throw new GraphQLError("Editing author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        })
      }
    },
    createUser: async (_, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      })

      try {
        return await user.save()
      } catch (error) {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        })
      }
    },
    login: async (_, args) => {
      const user = await User.findOne({ username: args.username })

      const doesNotHaveUser = !user || args.password !== "secret"
      if (doesNotHaveUser) {
        throw new GraphQLError("wrong credentials", {
          extensions: { code: "BAD_USER_INPUT" },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const getCurrentUser = async (auth) => {
  const doesNotHaveAuthorization = !auth || !auth.startsWith("Bearer ")
  if (doesNotHaveAuthorization) {
    return null
  }

  const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
  return User.findById(decodedToken.id)
}

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const currentUser = await getCurrentUser(req.headers.authorization)
    return { currentUser }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
