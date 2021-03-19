const { Schema, model } = require('mongoose');
const joi = require("@hapi/joi");

const createUsuarioSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  usuario: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  }
});

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
  userSchema: model("Usuario", createUsuarioSchema),
  idSchema,
  createUserSchema,
  updateUserSchema,
};
