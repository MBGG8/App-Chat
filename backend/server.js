const { ApolloServer } = require("apollo-server");
const messageTypeDefs = require("./typeDefs/messageTypeDef");
const authTypeDefs = require("./typeDefs/authTypeDef");
const messageResolver = require("./resolvers/messageResolver");
const authResolver = require("./resolvers/authResolver");

const server = new ApolloServer({
  typeDefs: [messageTypeDefs, authTypeDefs],
  resolvers: [messageResolver, authResolver],
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
