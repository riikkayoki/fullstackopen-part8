const { GraphQLError } = require("graphql")

const Author = require("../models/author")
const Book = require("../models/book")
const User = require("../models/user")

module.exports = {
  Mutation: {
    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== "test") {
        throw new GraphQLError("_resetDatabase is only available in test mode", {
          extensions: { code: "FORBIDDEN" },
        })
      }

      await Author.deleteMany({})
      await Book.deleteMany({})
      await User.deleteMany({})
      return true
    },
  },
}
