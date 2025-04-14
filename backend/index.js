const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const http = require("http");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { PubSub } = require("graphql-subscriptions");
const { useServer } = require("graphql-ws/lib/use/ws");
const { WebSocketServer } = require("ws");

const pubsub = new PubSub();
const app = express();
const httpServer = http.createServer(app);

let users = [];
let messages = [];

let userIdCounter = 1;
let messageIdCounter = 1;

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
  }

  type Message {
    id: ID!
    user: String!
    text: String!
    timestamp: String!
    channel: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    messages(channel: String!): [Message]
  }

  type Mutation {
    login(username: String!, password: String!): AuthPayload
    register(username: String!, password: String!): AuthPayload
    sendMessage(user: String!, text: String!, channel: String!): Message
  }

  type Subscription {
    messageSent(channel: String!): Message
  }
`;

const resolvers = {
  Query: {
    messages: (_, { channel }) => {
      return messages.filter((msg) => msg.channel === channel);
    },
  },

  Mutation: {
    login: async (_, { username, password }) => {
      const user = users.find((u) => u.username === username);
      if (!user) throw new Error("Usuario no encontrado");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Contraseña incorrecta");

      const token = jwt.sign({ userId: user.id }, "secretKey", {
        expiresIn: "1h",
      });

      return {
        token,
        user: { id: user.id, username: user.username },
      };
    },

    register: async (_, { username, password }) => {
      const existing = users.find((u) => u.username === username);
      if (existing) throw new Error("El usuario ya existe");

      const hashed = await bcrypt.hash(password, 10);
      const newUser = {
        id: userIdCounter++,
        username,
        password: hashed,
      };
      users.push(newUser);

      const token = jwt.sign({ userId: newUser.id }, "secretKey", {
        expiresIn: "1h",
      });

      return {
        token,
        user: { id: newUser.id, username: newUser.username },
      };
    },

    sendMessage: (_, { user, text, channel }) => {
      const message = {
        id: messageIdCounter++,
        user,
        text,
        timestamp: new Date().toISOString(),
        channel,
      };
      messages.push(message);
      pubsub.publish(`MESSAGE_SENT_${channel}`, { messageSent: message });
      return message;
    },
  },

  Subscription: {
    messageSent: {
      subscribe: (_, { channel }) =>
        pubsub.asyncIterator(`MESSAGE_SENT_${channel}`),
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});
useServer({ schema }, wsServer);

const startApolloServer = async () => {
  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const token = req.headers.authorization || "";
      try {
        const decoded = jwt.verify(token, "secretKey");
        return { userId: decoded.userId };
      } catch {
        return {};
      }
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  httpServer.listen(4000, () => {
    console.log(
      "🚀 Servidor GraphQL sin BD corriendo en http://localhost:4000/graphql"
    );
  });
};

startApolloServer();
