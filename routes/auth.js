const express = require("express");
const passport = require("passport");
const boom = require("@hapi/boom");
const jwt = require("jsonwebtoken");
const ApiKeysService = require("../services/apiKeys");
const UsersService = require("../services/usuarios");
const { config } = require("../config");
const { validationHandler } = require("../utils/middleware/validationHandler");

const {
  createUserSchema,
  updateUserSchema,
  idSchema,
} = require("../utils/schemas/usuarios");

// Basic strategy
require("../utils/auth/strategies/basic");
// JWT strategy
require("../utils/auth/strategies/jwt");

const authApi = (app) => {
  const router = express.Router();
  app.use("/api/auth", router);

  const apiKeysService = new ApiKeysService();
  const usersService = new UsersService();

  router.post("/entrar", async (req, res, next) => {
    const { apiKeyToken } = req.body;

    if (!apiKeyToken) {
      next(boom.unauthorized("apiKeyToken es requerido"));
    }

    passport.authenticate("basic", (error, user) => {
      try {
        if (error || !user) {
          next(boom.unauthorized("Usuario o contraseña incorrectos"));
        }

        req.login(user, { session: false }, async (error) => {
          if (error) {
            next(error);
          }

          const apiKey = await apiKeysService.getApiKey({ token: apiKeyToken });

          if (!apiKey) {
            next(boom.unauthorized());
          }

          const { _id, nombre, apellido, usuario, rol } = user;

          const payload = {
            sub: _id,
            nombre,
            apellido,
            usuario,
            rol,
            scopes: apiKey.scopes,
          };

          const token = jwt.sign(payload, config.authJwtSecret, {
            expiresIn: "45m",
          });

          return res.status(200).json({
            token,
            user: {
              _id,
              nombre,
              apellido,
              usuario,
              rol,
            },
          });
        });
      } catch (e) {
        next(e);
      }
    })(req, res, next);
  });

  // implementar el middleware de validacion de scopes
  // solos usuarios admin pueden registrar otros usuarios
  router.post(
    "/registrar",
    validationHandler(createUserSchema),
    async (req, res, next) => {
      const { body: user } = req;

      try {
        const createUserId = await usersService.createUser({ user });

        res.status(201).json({
          _id: createUserId,
          message: "Usuario registrado correctamente",
        });
      } catch (e) {
        next(e);
      }
    }
  );

  router.post(
    "/validar",
    passport.authenticate("jwt", { session: false }),
    async (req, res, next) => {
      const { apiKeyToken } = req.body;

      const user = req.user;

      const apiKey = await apiKeysService.getApiKey({ token: apiKeyToken });

      if (!apiKey) {
        next(boom.unauthorized());
      }

      const { _id, nombre, apellido, usuario, rol } = user;

      const payload = {
        sub: _id,
        nombre,
        apellido,
        usuario,
        rol,
        scopes: apiKey.scopes,
      };

      const token = jwt.sign(payload, config.authJwtSecret, {
        expiresIn: "45m",
      });

      return res.status(200).json({
        token,
        user: {
          _id,
          nombre,
          apellido,
          usuario,
          rol,
        },
      });
    }
  );
};


module.exports = authApi;
