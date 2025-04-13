const pubsub = require("../utils/pubsub");
const MESSAGE_ADDED = "MESSAGE_ADDED";

let messages = [];

const resolvers = {
  Query: {
    messages: () => messages,
  },
  Mutation: {
    sendMessage: (_, { content }) => {
      const newMessage = {
        id: String(messages.length + 1),
        content,
        timestamp: new Date().toISOString(),
      };
      messages.push(newMessage);
      pubsub.publish(MESSAGE_ADDED, { messageAdded: newMessage });
      return newMessage;
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: () => pubsub.asyncIterator([MESSAGE_ADDED]),
    },
  },
};

module.exports = resolvers;
