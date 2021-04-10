const { ProveedorSchema } = require("../utils/schemas/proveedores");
const {
  ContactoProveedorSchema,
} = require("../utils/schemas/contactosProveedor");

class ProveedoresService {

  
  async getProveedores() {
    const proveedores = await ProveedorSchema.find()
      .populate("contactos")
      .sort({ nombre: 1 });
    return proveedores || [];
  }

  async getProveedor(proveedorId) {
    const proveedor = await ProveedorSchema.findById(proveedorId).populate(
      "contactos"
    );
    return proveedor || {};
  }

  async createProveedor({ proveedor }) {
    const createdProveedor = await (
      await ProveedorSchema.create(proveedor)
    ).save();
    return createdProveedor;
  }

  async updateProveedor({ proveedorId, proveedor }) {
    const updatedProveedor = await ProveedorSchema.findByIdAndUpdate(
      proveedorId,
      proveedor
    );
    return updatedProveedor;
  }

  async deleteProveedor(proveedorId) {
    const proveedor = await ProveedorSchema.findById(proveedorId);
    Promise.all(
      proveedor.contactos.map(async (contacto) => {
        await ContactoProveedorSchema.findByIdAndDelete(contacto);
      })
    );
    const deletedProveedor = await ProveedorSchema.findByIdAndDelete(
      proveedorId
    );
    return deletedProveedor;
  }
}

module.exports = ProveedoresService;
