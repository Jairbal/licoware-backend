const { MongoLib } = require("../lib/mongo");
const ContactosProveedorService = require("./contactosProveedor");

class ProveedoresService {
  constructor() {
    this.collection = "proveedores";
    this.mongoDB = new MongoLib();
    this.contactosProveedorService = new ContactosProveedorService();
  }

  async getProveedores() {
    // obtiene los proveedores de la BD
    const proveedores = await this.mongoDB.getAll(this.collection, {}, {nombre: 1});
    // mapea los proveedores y a cada proveedor le agrega sus contactos
    const proveedorConContactos = Promise.all(
      proveedores.map(async (proveedor) => ({
        ...proveedor,
        contactos: await this.contactosProveedorService.getContactosProveedor(
          proveedor._id
        ),
      }))
    );
    return proveedorConContactos || [];
  }

  async getProveedor(proveedorId) {
    // Obtiene el proveedor de la BD
    const proveedor = await this.mongoDB.get(this.collection, proveedorId);
    const proveedorConContactos = {
      ...proveedor,
      contactos: await this.contactosProveedorService.getContactosProveedor(proveedor._id)
    }
    return proveedorConContactos || {};
  }

  async createProveedor({ proveedor }) {
    const createdProveedorId = await this.mongoDB.create(
      this.collection,
      proveedor
    );
    return createdProveedorId;
  }

  async updateProveedor({ proveedorId, proveedor }) {
    const updatedProveedorId = await this.mongoDB.update(
      this.collection,
      proveedorId,
      proveedor
    );
    return updatedProveedorId;
  }

  async deleteProveedor(proveedorId) {
    await this.contactosProveedorService.deleteContactosProveedorWithProveedorId(proveedorId);
    const deletedProveedorId = await this.mongoDB.delete(
      this.collection,
      proveedorId
    );

    return deletedProveedorId;
  }
}

module.exports = ProveedoresService;
