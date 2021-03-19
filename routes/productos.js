const express = require("express");
const passport = require("passport");
const multer = require("multer");
const path = require("path");
const {config} = require("../config/index");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads/productos"));
  },
  filename: function (req, file, cb) {
    cb(null, `Producto-${Date.now()}.${file.mimetype.split("/")[1]}`);
  },
});

const upload = multer({ storage });

const ProductosService = require("../services/productos");

const {
  idSchema,
  createProductoSchema,
  updateProductoSchema,
} = require("../utils/schemas/productos");

const { validationHandler } = require("../utils/middleware/validationHandler");
const scopesValidationHandler = require("../utils/middleware/scopesValidationHandler");

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
          message: "produtos listados",
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
    validationHandler(createProductoSchema),
    upload.single("imagen"),
    async (req, res, next) => {
      const {body: producto, file} = req;
      console.log(producto)
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

        const createdProducto = await productosService.createProducto({
          producto,
        });
        
        res.status(201).json({
          _id: createdProducto._id,
          message: "Producto Creado",
          produto: createdProducto,
        });
      } catch (e) {
        next(e);
      }
    }
  );
};

module.exports = productosApi;
