const { Schema, model } = require("mongoose");
const joi = require("@hapi/joi");
const idSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const nombre = joi.string();

const CategoriaSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
});

CategoriaSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

const createCategoriaSchema = {
  nombre: nombre.required(),
};

module.exports = {
  CategoriaSchema: model("Categoria", CategoriaSchema),
  createCategoriaSchema,
  idSchema,
};
