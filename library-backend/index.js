require("dotenv").config()
const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

const User = require("./models/user")
const typeDefs = require("./schema")
const resolvers = require("./resolvers")

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
