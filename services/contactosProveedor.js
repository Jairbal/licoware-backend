const { ObjectId } = require("mongodb");
const { MongoLib } = require("../lib/mongo");

class ContactosProveedorService {
  constructor() {
    this.collection = "contactosProveedor";
    this.mongoDB = new MongoLib();
  }

  async getContactosProveedor(proveedorId) {
    const contactosProveedor = await this.mongoDB.getAll(this.collection, {
      proveedorId,
    });
    return contactosProveedor || [];
  }

  async getContactoProveedor(contactoProveedorId) {
    const contactoProveedor = await this.mongoDB.get(
      this.collection,
      contactoProveedorId
    );
    return contactoProveedor || {};
  }

  async createContactoProveedor(contactoProveedor) {
    contactoProveedor.proveedorId = ObjectId(contactoProveedor.proveedorId);
    const createdContactoProveedorId = await this.mongoDB.create(
      this.collection,
      contactoProveedor
    );
    return createdContactoProveedorId;
  }

  async updateContactoProveedor({ contactoProveedorId, contactoProveedor }) {
    const updatedContactoProveedorId = await this.mongoDB.update(
      this.collection,
      contactoProveedorId,
      contactoProveedor
    );
    return updatedContactoProveedorId;
  }

  async deleteContactoProveedor(contactoProveedorId) {
    const deletedContactoProveedorId = await this.mongoDB.delete(
      this.collection,
      contactoProveedorId
    );
    return deletedContactoProveedorId;
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
