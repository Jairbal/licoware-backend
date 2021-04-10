const express = require("express");
const passport = require("passport");
const path = require("path");
const { DateTime } = require("luxon");
const multer = require("multer");
const { config } = require("../config/index");

const ProductosService = require("../services/productos");

const {
  idSchema,
  createProductoSchema,
  updateProductoSchema,
} = require("../utils/schemas/productos");

const { validationHandler } = require("../utils/middleware/validationHandler");
const scopesValidationHandler = require("../utils/middleware/scopesValidationHandler");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads/productos"));
  },
  filename: function (req, file, cb) {
    cb(null, `Producto-${Date.now()}.${file.mimetype.split("/")[1]}`);
  },
});

const upload = multer({ storage });

// JWT Strategy
require("../utils/auth/strategies/jwt");

const productosApi = (app) => {
  const router = express.Router();
  app.use("/api/productos", router);

  const productosService = new ProductosService();

  router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    scopesValidationHandler(["read:productos"]),
    async (req, res, next) => {
      try {
        const productos = await productosService.getProductos();
        res.status(200).json({
          data: productos,
          message: "procdutos listados",
        });
      } catch (e) {
        next(e);
      }
    }
  );

  router.get(
    "/:productoId",
    passport.authenticate("jwt", { session: false }),
    scopesValidationHandler(["read:productos"]),
    validationHandler({ productoId: idSchema }, "params"),
    async (req, res, next) => {
      const { productoId } = req.params;
      try {
        const producto = await productosService.getProducto(productoId);

        res.status(200).json({
          producto,
          message: "Producto Listado",
        });
      } catch (e) {
        next(e);
      }
    }
  );

  router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    scopesValidationHandler(["create:productos"]),
    upload.single("imagen"),
    validationHandler(createProductoSchema),
    async (req, res, next) => {
      const { body: producto, file } = req;
      try {
        const existedProducto = await productosService.getProductoByNombre(
          producto.nombre
        );

        if (existedProducto.length > 0) {
          res.status(400).json({
            message: "Ya existe este producto",
          });
          return;
        }

        producto.imagen = `${config.host}/uploads/productos/${file.filename}`;
        producto.createdAt = DateTime.local();

        const createdProducto = await productosService.createProducto({
          producto,
        });

        res.status(201).json({
          _id: createdProducto._id,
          message: "Producto Creado",
          producto: createdProducto,
        });
      } catch (e) {
        next(e);
      }
    }
  );

  router.put(
    "/:productoId",
    passport.authenticate("jwt", { session: false }), 
    scopesValidationHandler(["update:productos"]),
    upload.single("imagen"),
    validationHandler({ productoId: idSchema }, "params"),
    validationHandler(updateProductoSchema),
    async (req, res, next) => {
      const { productoId } = req.params;
      let producto = req.body;
      const file = req.file;
      console.log(producto)
      try {

        if(file){
          console.log(file)
          producto.imagen = `${config.host}/uploads/productos/${file.filename}`;
        }

        const updatedProductoId = await productosService.updateProducto({
          productoId,
          producto,
        });

        producto = await productosService.getProducto(productoId);

        res.status(200).json({
          _id: updatedProductoId,
          message: "Producto actualizado",
          producto,
        });
      } catch (e) {
        next(e);
      }
    }
  );

  router.delete(
    "/:productoId",
    passport.authenticate("jwt", { session: false }),
    scopesValidationHandler(["delete:productos"]),
    validationHandler({ productoId: idSchema }, "params"),
    async (req, res, next) => {
      const { productoId } = req.params;
      try {
        const deletedProductoId = await productosService.deleteProducto(
          productoId
        );

        res.status(200).json({
          _id: deletedProductoId,
          message: "Factura Eliminada",
        });
      } catch (e) {
        next(e);
      }
    }
  );
};

module.exports = productosApi;
