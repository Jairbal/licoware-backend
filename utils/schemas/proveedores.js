const { Schema, model } = require("mongoose");
const joi = require('@hapi/joi');
const idSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const nombre = joi.string().max(100);
const direccion = joi.string().max(200);
const telefono = joi.string().max(10);
const contactos = joi.array();


const ProveedorSchema = Schema({
    nombre: {
        type: String,
        required: true,
    },
    direccion: {
        type: String,
        required: true,
    },
    telefono: {
        type: String,
        required: true,
    },
    contactos: [{
        type: Schema.Types.ObjectId,
        ref: "ContactoProveedor"
    }]
});

ProveedorSchema.method('toJSON', function() {
    const {__v, ...object} = this.toObject();
    return object;
})

const createProveedorSchema = {
    nombre: nombre.required(),
    direccion: direccion.required(),
    telefono,
};

const updateProveedorSchema = {
    nombre,
    direccion,
    telefono,
    contactos,
};

module.exports = {
    ProveedorSchema: model("Proveedor", ProveedorSchema),
    createProveedorSchema,
    updateProveedorSchema,
    idSchema
};