const joi = require('@hapi/joi');

const idSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const nombre = joi.string().max(100);
const direccion = joi.string().max(200);
const telefono = joi.string().max(10);

const createProveedorSchema = {
    nombre: nombre.required(),
    direccion: direccion.required(),
    telefono,
};

const updateProveedorSchema = {
    nombre,
    direccion,
    telefono
};

module.exports = {
    createProveedorSchema,
    updateProveedorSchema,
    idSchema
};