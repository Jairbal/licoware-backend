const express = require("express");
const passport = require("passport");
const UsuariosService = require("../services/usuarios");

const {
  idSchema,
  createUsuarioSchema,
  updateUsuarioSchema,
} = require("../utils/schemas/usuarios");

const { validationHandler } = require("../utils/middleware/validationHandler");
const scopesValidationHandler = require("../utils/middleware/scopesValidationHandler");
const { DateTime } = require("luxon");

// JWT Strategy
require("../utils/auth/strategies/jwt");

const usuariosApi = (app) => {
  const router = express.Router();
  app.use("/api/usuarios", router);

  const usuariosService = new UsuariosService();

  router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    scopesValidationHandler(["read:usuarios"]),
    async (req, res, next) => {
      try {
        const usuarios = await usuariosService.getUsuarios();

        res.status(200).json({
          data: usuarios,
          message: "Usuarios Listados",
        });
      } catch (e) {
        next(e);
      }
    }
  );

  router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    scopesValidationHandler(["create:usuarios"]),
    validationHandler(createUsuarioSchema),
    async (req, res, next) => {
      const usuario = req.body;
      try {
        usuario.password = usuario.usuario;
        usuario.createdAt = DateTime.local();
        console.log(usuario)
        const createdUsuario = await usuariosService.createUser({
          usuario,
        });

        res.status(201).json({
          _id: createdUsuario._id,
          message: "Usuario creado",
          usuario: createdUsuario,
        });
      } catch (e) {
        next(e);
      }
    }
  );

  router.put(
    "/:pusuarioId",
    passport.authenticate("jwt", { session: false }),
    scopesValidationHandler(["update:usuarios"]),
    validationHandler({ usuarioId: idSchema }, "params"),
    validationHandler(updateUsuarioSchema),
    async (req, res, next) => {
      const { usuarioId } = req.params;
      let { usuario } = req.body;
      try {
        const updatedUsuarioId = await usuariosService.updateUser({
          usuarioId,
          usuario,
        });

        usuario = await usuariosService.getUserById(usuarioId);
        delete usuario.password;

        res.status(200).json({
          _id: updatedUsuarioId,
          message: "Usuario Actualizado",
          usuario,
        });
      } catch (e) {
        next(e);
      }
    }
  );

  router.delete(
    "/usuairoId",
    passport.authenticate("jwt", { session: false }),
    scopesValidationHandler(["delete:usuarios"]),
    validationHandler({ usuarioId: idSchema }, "params"),
    async (req, res, next) => {
      const { usuarioId } = req.params;
      try {
        const deletedusuarioId = await usuariosService.deleteUser(usuarioId);

        res.status(200).json({
          _id: deletedusuarioId,
          message: "Usuario Eliminado",
        });
      } catch (e) {
        next(e);
      }
    }
  );
};

module.exports = usuariosApi;
