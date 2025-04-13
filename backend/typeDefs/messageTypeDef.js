const { gql } = require("apollo-server");

const typeDefs = gql`
  type Message {
    id: ID!
    content: String!
    timestamp: String!
  }

  type Query {
    messages: [Message!]!
  }

  type Mutation {
    sendMessage(content: String!): Message!
  }

  type Subscription {
    messageAdded: Message!
  }
`;

module.exports = typeDefs;
