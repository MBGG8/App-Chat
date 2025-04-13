const bcrypt = require('bcryptjs');

const users = [
  {
    username: "pedro",
    password: bcrypt.hashSync("123456", 10), // Contraseña encriptada
  },
  {
    username: "juan",
    password: bcrypt.hashSync("123456", 10),
  },
];

module.exports = users;
