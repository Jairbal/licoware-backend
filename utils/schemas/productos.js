const { Schema, model } = require("mongoose");
const joi = require("@hapi/joi");
const idSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const nombre = joi.string();
const descripcion = joi.string();
const stock = joi.number();
const precioVenta = joi.number();
const imagen = joi.binary();

const ProductoSchema = Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  descripcion: String,
  categoria: {
    type: Schema.Types.ObjectId,
    ref: "Categoria",
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  precioVenta: {
    type: Number,
    required: true,
  },
  imagen: String
});

ProductoSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

const createProductoSchema = {
  creator: idSchema.required(),
  nombre: nombre.required(),
  descripcion,
  categoria: idSchema.required(),
  stock: stock.required(),
  precioVenta: precioVenta.required(),
  imagen,
};

const updateProductoSchema = {
  nombre,
  descripcion,
  categoria: idSchema.required(),
  stock,
  precioVenta,
  imagen,
};

module.exports = {
  ProductoSchema: model("Producto", ProductoSchema),
  createProductoSchema,
  updateProductoSchema,
  idSchema,
};
