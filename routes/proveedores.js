const express = require("express");
const passport = require("passport");
const ProveedoresService = require("../services/proveedores");
const ContactosProveedorService = require("../services/contactosProveedor");

const {
  idSchema,
  createProveedorSchema,
  updateProveedorSchema,
} = require("../utils/schemas/proveedores");

const {
  createContactoProveedorSchema,
  updateContactoProveedorSchema,
} = require("../utils/schemas/contactosProveedor");

const {validationHandler} = require("../utils/middleware/validationHandler");
const scopesValidationHandler = require("../utils/middleware/scopesValidationHandler");

// JWT Strategy
require("../utils/auth/strategies/jwt");

const proveedoresApi = (app) => {
  const router = express.Router();
  app.use("/api/proveedores", router);

  const proveedoresService = new ProveedoresService();
  const contactosProveedorService = new ContactosProveedorService();

  router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    scopesValidationHandler(['read:proveedores']),
    async (req, res, next) => {
      try {
        const proveedores = await proveedoresService.getProveedores();
        res.status(200).json({
          data: proveedores,
          message: "proveedores listados",
        });
      } catch (e) {
        next(e);
      }
    }
  );

  router.get(
    "/:proveedorId",
    validationHandler({ proveedorId: idSchema }, "params"),
    async (req, res, next) => {
      const { proveedorId } = req.params;
      try {
        const proveedor = await proveedoresService.getProveedor(proveedorId);

        res.status(200).json({
          data: proveedor,
          message: "proveedor listado",
        });
      } catch (e) {
        next(e);
      }
    }
  );

  router.post(
    "/",
    validationHandler(createProveedorSchema),
    async (req, res, next) => {
      const proveedor = req.body;
      try {
        const createdProveedorId = await proveedoresService.createProveedor({
          proveedor,
        });

        res.status(201).json({
          _id: createdProveedorId,
          message: "Provedoor creado",
        });
      } catch (e) {
        next(e);
      }
    }
  );

  router.put(
    "/:proveedorId",
    validationHandler({ proveedorId: idSchema }, "params"),
    validationHandler(updateProveedorSchema),
    async (req, res, next) => {
      const { proveedorId } = req.params;
      const proveedor = req.body;
      try {
        const updatedProveedorId = await proveedoresService.updateProveedor({
          proveedorId,
          proveedor,
        });

        res.status(200).json({
          _id: updatedProveedorId,
          message: "Provedoor actualizado",
        });
      } catch (e) {
        next(e);
      }
    }
  );

  router.delete(
    "/:proveedorId",
    validationHandler({ proveedorId: idSchema }, "params"),
    async (req, res, next) => {
      const { proveedorId } = req.params;
      try {
        const deletedProveedorId = await proveedoresService.deleteProveedor(
          proveedorId
        );

        res.status(200).json({
          _id: deletedProveedorId,
          message: "Provedoor eliminado",
        });
      } catch (e) {
        next(e);
      }
    }
  );

  // contactos del proveedor
  router.post(
    "/:proveedorId",
    validationHandler({ proveedorId: idSchema }, "params"),
    validationHandler(createContactoProveedorSchema),
    async (req, res, next) => {
      try {
        const { proveedorId } = req.params;
        const contactoProveedor = req.body;
        if (proveedorId === contactoProveedor.proveedorId) {
          const createdContatoProveedorId = await contactosProveedorService.createContactoProveedor(
            contactoProveedor
          );

          res.status(201).json({
            _id: createdContatoProveedorId,
            message: "Contacto creado",
          });
        }
      } catch (e) {
        next(e);
      }
    }
  );

  router.get(
    "/:proveedorId/:contactoProveedorId",
    validationHandler({ proveedorId: idSchema }, "params"),
    validationHandler({ contactoProveedorId: idSchema }, "params"),
    async (req, res, next) => {
      try {
        const { proveedorId } = req.params;
        const { contactoProveedorId } = req.params;

        // valida que el contacto a obtener pertenezca al proveedor de la ruta
        const contactoProveedor = await contactosProveedorService.getContactoProveedor(
          contactoProveedorId
        );
        if (contactoProveedor._id === proveedorId) {
          res.status(200).json({
            data: contactoProveedor,
            message: "contacto listado",
          });
        } else {
          new Error("El contacto a obtener no pertenece al proveedor indicado");
        }
      } catch (e) {
        next(e);
      }
    }
  );

  router.put(
    "/:proveedorId/:contactoProveedorId",
    validationHandler({ proveedorId: idSchema }, "params"),
    validationHandler({ contactoProveedorId: idSchema }, "params"),
    validationHandler(updateContactoProveedorSchema),
    async (req, res, next) => {
      try {
        const { proveedorId, contactoProveedorId } = req.params;
        const nuevoContactoProveedor = req.body;
        console.log(req.params);

        // valida que el contacto que esta eliminando pertenezca al proveedor de la ruta
        const contactoProveedor = await contactosProveedorService.getContactoProveedor(
          contactoProveedorId
        );
        if (proveedorId === contactoProveedor._id) {
          const updatedContactoProveedorId = await contactosProveedorService.updateContactoProveedor(
            { contactoProveedorId, nuevoContactoProveedor }
          );
          res.statu(200).json({
            _id: updatedContactoProveedorId,
            message: "Contacto actualizado",
          });
        } else {
          new Error(
            "El contacto a actualizar no pertenece al proveedor indicado"
          );
        }
      } catch (e) {
        next(e);
      }
    }
  );

  router.delete(
    "/:proveedorId/:contactoProveedorId",
    validationHandler({ proveedorId: idSchema }, "params"),
    validationHandler({ contactoProveedorId: idSchema }, "params"),
    async (req, res, next) => {
      try {
        const { proveedorId } = req.params;
        const { contactoProveedorId } = req.params;

        const contactProveedor = await contactosProveedorService.getContactoProveedor(
          contactoProveedorId
        );
        // valida que el contacto que va a eliminar pertenezca al proveedor de la ruta
        if (contactProveedor._id === proveedorId) {
          const deletedContactoProveedorId = await contactProveedorService.deleteContacto(
            contactProveedor
          );

          res.status(200).json({
            _id: deletedContactoProveedorId,
            message: "Contacto elimindo",
          });
        } else {
          new Error(
            "El contacto a eliminar no pertenece al proveedor indicado"
          );
        }
      } catch (e) {
        next(e);
      }
    }
  );
};

module.exports = proveedoresApi;
