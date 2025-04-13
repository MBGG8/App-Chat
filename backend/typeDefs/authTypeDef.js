const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    username: String!
    token: String!
  }

  type Mutation {
    login(username: String!, password: String!): User!
  }
`;

module.exports = typeDefs;
