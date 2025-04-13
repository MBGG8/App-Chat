const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const users = require("../utils/users");
const { jwtSecret } = require("../config/jwtSecret");

const resolvers = {
  Mutation: {
    login: (_, { username, password }) => {
      const user = users.find((u) => u.username === username);
      if (!user || !bcrypt.compareSync(password, user.password)) {
        throw new Error("Credenciales inválidas");
      }
      const token = jwt.sign({ username: user.username }, jwtSecret, {
        expiresIn: "1h",
      });
      return { username: user.username, token };
    },
  },
};

module.exports = resolvers;
