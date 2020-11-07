const joi = require('@hapi/joi');

const idSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const nombre = joi.string().max(100);
const telefono = joi.string().max(10);
const cargo = joi.string().max(100);

const createContactoProveedorSchema = {
    proveedorId: idSchema.required(),
    nombre: nombre.required(),
    telefono: telefono.required(),
    cargo,
};

const updateContactoProveedorSchema = {
    proveedorId: idSchema,
    nombre,
    telefono,
    cargo
};

module.exports = {
    createContactoProveedorSchema,
    updateContactoProveedorSchema,
    idSchema
};