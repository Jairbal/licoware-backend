const passport = require("passport");
const { BasicStrategy } = require("passport-http");
const boom = require("@hapi/boom");
const bcrypt = require("bcrypt");

const UsersService = require("../../../services/usuarios");

passport.use(
  new BasicStrategy(async (username, password, cb) => {
    const usersService = new UsersService();
    try {
      const user = await usersService.getUserByUsuario(username);

      if (!user) {
        return cb(boom.unauthorized('Usuario no encontrado'), false);
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return cb(boom.unauthorized('Contraseña incorrecta'), false);
      }

      delete user.password;

      return cb(null, user);
    } catch (e) {
      return cb(e);
    }
  })
);
