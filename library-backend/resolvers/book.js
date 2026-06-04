const { GraphQLError } = require("graphql")

const Book = require("../models/book")
const Author = require("../models/author")

module.exports = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
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
  },
}
