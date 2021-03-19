const { Schema, model } = require("mongoose");
const joi = require("@hapi/joi");

const idSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const cantidad = joi.number();
const precioUnitario = joi.number();
const precioTotal = joi.number();

const DetalleFacturaSchema = Schema({
  facturaId: {
    type: Schema.Types.ObjectId,
    ref: "Factura",
    required: true,
  },
  productoId: {
    type: Schema.Types.ObjectId,
    ref: "Producto",
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
  },
  precioUnitario: {
    type: Number,
    required: true,
  },
  precioTotal: {
    type: Number,
    required: true,
  },
});

DetalleFacturaSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

const createDetalleFacturaSchema = {
  facturaId: idSchema.required(),
  productoId: idSchema.required(),
  cantidad: cantidad.required(),
  precioUnitario: precioUnitario.required(),
  precioTotal: precioTotal.required(),
};

const updateDetalleFacturaSchema = {
  facturaId,
  productoId,
  cantidad,
  precioUnitario,
  precioTotal,
};

module.exports = {
  DetalleFacturaSchema: model("DetalleFactura", DetalleFacturaSchema),
  createDetalleFacturaSchema,
  updateDetalleFacturaSchema,
  idSchema,
};
