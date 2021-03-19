//const { ObjectId } = require("mongodb");
//const { MongoLib } = require("../lib/mongo");
const mongoose = require("mongoose");
const {
  ContactoProveedorSchema,
} = require("../utils/schemas/contactosProveedor");
const { ProveedorSchema } = require("../utils/schemas/proveedores");

class ContactosProveedorService {
  async getContactoProveedor(contactoProveedorId) {
    const contactoProveedor = await ContactoProveedorSchema.findOne({
      proveedorId: mongoose.Types.ObjectId(contactoProveedorId),
    });

    return contactoProveedor || {};
  }

  async createContactoProveedor(contactoProveedor) {
    const contactoProveedorCreated = await (
      await ContactoProveedorSchema.create(contactoProveedor)
    ).save();
    await ProveedorSchema.findByIdAndUpdate(contactoProveedor.proveedorId, {
      $addToSet: {
        contactos: [contactoProveedorCreated._id],
      },
    });
    return contactoProveedorCreated;
  }

  async updateContactoProveedor(contactoProveedorId, contactoProveedor) {
    const contactoProveedorUpdated = await ContactoProveedorSchema.findByIdAndUpdate(
      contactoProveedorId,
      contactoProveedor
    );
    return contactoProveedorUpdated._id;
  }

  async deleteContactoProveedor(contactoProveedorId) {
    const deletedProveedor = await ContactoProveedorSchema.findByIdAndDelete(
      contactoProveedorId
    );
    console.log(deletedProveedor);
    return null;
  }

  async deleteContactoProveedor(id) {
    await this.mongoDB.delete(this.collection, id);
  }

  async deleteContactosProveedorWithProveedorId(proveedorId) {
    await this.mongoDB.deleteMany(this.collection, {
      proveedorId: ObjectId(proveedorId),
    });
  }
}

module.exports = ContactosProveedorService;
