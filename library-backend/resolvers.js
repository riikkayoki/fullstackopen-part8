const author = require("./resolvers/author")
const book = require("./resolvers/book")
const user = require("./resolvers/user")
const admin = require("./resolvers/admin")

const resolverMaps = [author, book, user, admin]

const typeNames = [
  ...new Set(resolverMaps.flatMap((resolverMap) => Object.keys(resolverMap))),
]

const resolvers = Object.fromEntries(
  typeNames.map((typeName) => [
    typeName,
    resolverMaps.reduce(
      (fields, resolverMap) => ({ ...fields, ...resolverMap[typeName] }),
      {},
    ),
  ]),
)

module.exports = resolvers
