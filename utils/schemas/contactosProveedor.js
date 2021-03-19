const { Schema, model } = require("mongoose");
const joi = require('@hapi/joi');

const idSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const nombre = joi.string().max(100);
const telefono = joi.string().max(10);
const cargo = joi.string().max(100);

const ContactoProveedorSchema = Schema({
    proveedorId: {
        type: Schema.Types.ObjectId,
        ref: "Proveedor",
        required: true,
    },
    nombre: {
        type: String,
        required: true,
    },
    telefono: {
        type: String,
        required: true,
    },
    cargo: String
});

ContactoProveedorSchema.method('toJSON', function() {
    const {__v, ...object} = this.toObject();
    return object;
})

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
    ContactoProveedorSchema: model("ContactoProveedor", ContactoProveedorSchema),
    createContactoProveedorSchema,
    updateContactoProveedorSchema,
    idSchema
};