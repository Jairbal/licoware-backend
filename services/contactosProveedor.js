const { MongoLib } = require("../lib/mongo");

class ContactosProveedorService {
  constructor() {
    this.collection = "contactosProveedor";
    this.mongoDB = new MongoLib();
  }

  async getContactosProveedor(proveedorId) {
    const contactosProveedor = await this.mongoDB.getAll(this.collection, {proveedorId});
    return contactosProveedor || [];
  }

  async getContactoProveedor(contactoProveedorId) {
    const contactoProveedor = await this.mongoDB.get(this.collection, contactoProveedorId);
    return contactoProveedor || {};
  }

  async createContactoProveedor({contactoProveedor}) {
      const createdContactoProveedorId = await this.mongoDB.create(this.collection, contactoProveedor);
      return createdContactoProveedorId;
  }

  async updateContactoProveedor({ contactoProveedorId, contactoProveedor}) {
    const updatedContactoProveedorId = await this.mongoDB.update(this.collection, contactoProveedorId, contactoProveedor);
    return updatedContactoProveedorId;
  }

  async deleteContactoProveedor(contactoProveedorId) {
      const deletedContactoProveedorId = await this.mongoDB.delete(this.collection, contactoProveedorId);
      return deletedContactoProveedorId;
  }

  async deleteContactosProveedor(proveedorId) {
    await this.mongoDB.delete(this.collection, proveedorId);
  }
}

module.exports = ContactosProveedorService;
