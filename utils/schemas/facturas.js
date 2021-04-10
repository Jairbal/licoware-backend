const { Schema, model } = require("mongoose");
const joi = require("@hapi/joi");
const numero = joi.string();
const idSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const fecha = joi.string();
const credito = joi.boolean();
const numeroProductos = joi.number().positive();
const fechaMaxPago = joi.string();
const metodoPago = joi.string();
const total = joi.number().positive();
const productos = joi.array();

const FacturaSchema = Schema({
  numero: {
    type: String,
    required: true,
  },
  proveedor: {
    type: Schema.Types.ObjectId,
    ref: "Proveedor",
    required: true,
  },
  fecha: {
    type: Date,
    required: true,
  },
  productos: {
    type: Array,
    required: true,
  },
  credito: {
    type: Boolean,
    required: true,
  },
  fechaMaxPago: Date,
  metodoPago: String,
  total: {
    type: Number,
    required: true,
    default: 0,
  },
  numeroProductos: {
    type: Number,
    required: true,
  }
});

FacturaSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

const createFacturaSchema = {
  numero: numero.required(),
  proveedor: idSchema.required(),
  fecha: fecha.required(),
  productos: productos.required(),
  credito: credito.required(),
  fechaMaxPago,
  metodoPago: metodoPago.required(),
  total,
};

const updateFacturaSchema = {
  numero,
  proveedor: idSchema,
  fecha,
  productos,
  credito,
  numeroProductos,
  fechaMaxPago,
  metodoPago,
  total,
};

module.exports = {
  FacturaSchema: model("Factura", FacturaSchema),
  createFacturaSchema,
  updateFacturaSchema,
  idSchema,
};
