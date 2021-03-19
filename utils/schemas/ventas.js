const { Schema, model } = require("mongoose");
const joi = require("@hapi/joi");

const idSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const cantidad = joi.number();
const fecha = joi.date();
const total = joi.number();

const VentaSchema = Schema({
  productoId: {
    type: Schema.Types.ObjectId,
    ref: "Producto",
    required: true,
  },
  usuarioId: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
  },
  fecha: {
    type: Date,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

VentaSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

const createVentaSchema = {
  productoId: idSchema.required(),
  usuarioId: idSchema.required(),
  cantidad: cantidad.required(),
  fecha: fecha.required(),
  total: total.required(),
};

const updateVentaSchema = {
  cantidad,
  fecha,
  total,
};

module.exports = {
  VentaSchema: model("Venta", VentaSchema),
  createVentaSchema,
  updateVentaSchema,
  idSchema,
};
