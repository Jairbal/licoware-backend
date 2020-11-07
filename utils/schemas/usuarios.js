const joi = require("@hapi/joi");

const idSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const nombre = joi.string();
const apellido = joi.string();
const usuario = joi.string();
const password = joi.string();
const rol = joi.string();
const createdAt = joi.string();

const createUserSchema = {
  nombre: nombre.required(),
  apellido: apellido.required(),
  usuario: usuario.required(),
  password: password.required(),
  rol: rol.required(),
  createdAt: createdAt.required()
};

const updateUserSchema = {
  nombre,
  apellido,
  usuario,
  password,
  rol,
  createdAt: createdAt.required(),
};

module.exports = {
  idSchema,
  createUserSchema,
  updateUserSchema,
};
