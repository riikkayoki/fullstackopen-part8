const { GraphQLError } = require("graphql")
const jwt = require("jsonwebtoken")

const User = require("../models/user")

module.exports = {
  Query: {
    me: (_, __, { currentUser }) => currentUser ?? null,
  },
  Mutation: {
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
