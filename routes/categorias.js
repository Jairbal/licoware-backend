const express = require("express");
const passport = require("passport");
const CategoriasService = require("../services/categorias");

const {
  idSchema,
  createCategoriaSchema,
} = require("../utils/schemas/categorias");

const { validationHandler } = require("../utils/middleware/validationHandler");
const scopesValidationHandler = require("../utils/middleware/scopesValidationHandler");

// JWT Strategy
require("../utils/auth/strategies/jwt");

const categoriasApi = (app) => {
  const router = express.Router();
  app.use("/api/categorias", router);

  const categoriasService = new CategoriasService();

  router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    scopesValidationHandler(["read:categorias"]),
    async (req, res, next) => {
      try {
        const categorias = await categoriasService.getCategorias();
        res.status(200).json({
          data: categorias,
          message: "Categorias Listadas",
        });
      } catch (e) {
        next(e);
      }
    }
  );

  router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    scopesValidationHandler(["create:categorias"]),
    validationHandler(createCategoriaSchema),
    async (req, res, next) => {
      const categoria = req.body;
      categoria.nombre = categoria.nombre.toUpperCase();
      try {
        const existedCategoria = await categoriasService.getCategoriaByNombre(
          categoria.nombre
        );

        if (existedCategoria.length > 0) {
          res.status(400).json({
            message: "Ya existe esta categoría",
          });
          return;
        }

        const createdCategoria = await categoriasService.createCategoria({
          categoria,
        });

        res.status(201).json({
          _id: createdCategoria._id,
          message: "Categoria Creada",
          categoria: createdCategoria,
        });
      } catch (e) {
        next(e);
      }
    }
  );

  router.delete(
    "/:categoriaId",
    passport.authenticate("jwt", { session: false }),
    scopesValidationHandler(["delete:categorias"]),
    validationHandler({ categoriaId: idSchema }, "params"),
    async (req, res, next) => {
      const { categoriaId } = req.params;
      try {
        const deletedCategoriaId = await categoriasService.deleteCategoria(
          categoriaId
        );

        res.status(200).json({
          _id: deletedCategoriaId,
          message: "Categoria Eliminada",
        });
      } catch (e) {
        next(e);
      }
    }
  );
};

module.exports = categoriasApi;
