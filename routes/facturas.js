const express = require("express");
const passport = require("passport");

const {
  idSchema,
  createFacturaSchema,
  updateFacturaSchema,
} = require("../utils/schemas/facturas");

const {validationHandler} = require("../utils/middleware/validationHandler");
const scopesValidationHandler = require("../utils/middleware/scopesValidationHandler");
const FacturasService = require("../services/facturas");

// JWT Strategy
require("../utils/auth/strategies/jwt");

const facturasApi = (app) => {
  const router = express.Router();
  app.use("/api/facturas", router);

  const facturasService = new FacturasService();

  router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    scopesValidationHandler(["read:facturas"]),
    async (req, res, next) => {
      try {
        const facturas = await facturasService.getFacturas();
        res.status(200).json({
          data: facturas,
          message: "facturas listados",
        });
      } catch (e) {
        next(e);
      }
    }
  );

  router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    scopesValidationHandler(["create:facturas"]),
    validationHandler(createFacturaSchema),
    async (req, res, next) => {
      const factura = req.body;
      try {
        const createdFactura = await facturasService.createFactura({
          factura,
        });

        res.status(201).json({
            _id: createdFactura._id,
            message: 'Factura creada',
            factura: createdFactura
        })
      } catch (e) {
        next(e);
      }
    }
  );
};

module.exports = facturasApi;